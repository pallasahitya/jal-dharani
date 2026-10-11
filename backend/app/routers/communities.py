import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from database import get_db
from app.models.user import User
from app.models.community import Community, CommunityMember, CommunityPost, Comment
from app.dependencies.auth import get_current_user
from app.schemas.community import (
    CommunityCreate,
    CommunityResponse,
    CommunityMemberResponse,
    CommunityPostCreate,
    CommunityPostResponse,
    CommentCreate,
    CommentResponse,
)
from app.schemas.geojson import GeoJSONFeatureCollection
from app.services.spatial import build_geojson_collection

router = APIRouter(prefix="/api/communities", tags=["Communities"])


@router.get("", response_model=List[CommunityResponse])
def get_communities(
    city: Optional[str] = None,
    water_body_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve all citizen conservation communities with optional filters."""
    query = db.query(Community)
    if city:
        query = query.filter(func.lower(Community.city) == city.lower())
    if water_body_id:
        query = query.filter(Community.water_body_id == water_body_id)
    return query.order_by(Community.created_at.desc()).all()


@router.get("/geojson", response_model=GeoJSONFeatureCollection)
def get_communities_geojson(db: Session = Depends(get_db)):
    """Returns all communities formatted as GeoJSON FeatureCollection for Leaflet map markers."""
    items = db.query(Community).all()

    def extractor(comm: Community):
        return {
            "name": comm.name,
            "tagline": comm.tagline,
            "city": comm.city,
            "memberCount": len(comm.members),
            "focusAreas": comm.focus_areas,
            "isDemoData": comm.is_demo_data,
        }

    return build_geojson_collection(items, extractor)


@router.get("/{community_id}", response_model=CommunityResponse)
def get_community(community_id: str, db: Session = Depends(get_db)):
    """Retrieve a community by ID with member roster and discussions."""
    comm = db.query(Community).filter(Community.id == community_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Community not found")
    return comm


@router.post("", response_model=CommunityResponse, status_code=status.HTTP_201_CREATED)
def create_community(
    payload: CommunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Creates a new citizen conservation collective with PostGIS location."""
    comm_id = payload.id or f"comm-{uuid.uuid4().hex[:8]}"
    point_geom = from_shape(Point(payload.longitude, payload.latitude), srid=4326)

    data = payload.model_dump(exclude={"id", "created_by_user_id"})
    comm = Community(
        id=comm_id,
        location_geom=point_geom,
        created_by_user_id=current_user.id,
        **data,
    )

    # Automatically add the authenticated creator as the initial admin member
    admin_member = CommunityMember(
        id=f"cm-{uuid.uuid4().hex[:8]}",
        community_id=comm_id,
        user_id=current_user.id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        role="admin",
        joined_at=datetime.now(timezone.utc),
    )

    db.add(comm)
    db.add(admin_member)
    db.commit()
    db.refresh(comm)
    return comm


@router.post("/{community_id}/join", response_model=CommunityMemberResponse, status_code=status.HTTP_201_CREATED)
def join_community(
    community_id: str,
    role: str = Query("volunteer"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Enrolls the authenticated user into a community."""
    comm = db.query(Community).filter(Community.id == community_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Community not found")

    existing = (
        db.query(CommunityMember)
        .filter(CommunityMember.community_id == community_id, CommunityMember.user_id == current_user.id)
        .first()
    )
    if existing:
        return existing

    member_id = f"cm-{uuid.uuid4().hex[:8]}"
    member = CommunityMember(
        id=member_id,
        community_id=community_id,
        user_id=current_user.id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        role=role,
        joined_at=datetime.now(timezone.utc),
    )

    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{community_id}/join", status_code=status.HTTP_204_NO_CONTENT)
def leave_community(
    community_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Removes the authenticated user from a community membership."""
    member = (
        db.query(CommunityMember)
        .filter(CommunityMember.community_id == community_id, CommunityMember.user_id == current_user.id)
        .first()
    )
    if member:
        db.delete(member)
        db.commit()
    return None


@router.post("/{community_id}/posts", response_model=CommunityPostResponse, status_code=status.HTTP_201_CREATED)
def create_community_post(
    community_id: str,
    payload: CommunityPostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Posts an update, observation, or question in a community hub."""
    comm = db.query(Community).filter(Community.id == community_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Community not found")

    post_id = f"post-{uuid.uuid4().hex[:8]}"
    data = payload.model_dump(exclude={"author_id", "author_name", "author_avatar"})
    post = CommunityPost(
        id=post_id,
        community_id=community_id,
        author_id=current_user.id,
        author_name=current_user.name,
        author_avatar=current_user.avatar,
        **data,
        created_at=datetime.now(timezone.utc),
    )

    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.post("/{community_id}/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_post_comment(
    community_id: str,
    post_id: str,
    payload: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Adds a comment/reply to a community discussion post."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id, CommunityPost.community_id == community_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment_id = f"comment-{uuid.uuid4().hex[:8]}"
    data = payload.model_dump(exclude={"author_id", "author_name", "author_avatar"})
    comment = Comment(
        id=comment_id,
        post_id=post_id,
        author_id=current_user.id,
        author_name=current_user.name,
        author_avatar=current_user.avatar,
        **data,
        created_at=datetime.now(timezone.utc),
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

