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
from app.models.activity import Activity, ActivityParticipation, ActivityImpact
from app.dependencies.auth import get_current_user
from app.schemas.activity import (
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    ActivityParticipationResponse,
    ActivityImpactCreate,
    ActivityImpactResponse,
)
from app.schemas.geojson import GeoJSONFeatureCollection
from app.services.spatial import build_geojson_collection

router = APIRouter(prefix="/api/activities", tags=["Activities"])


@router.get("", response_model=List[ActivityResponse])
def get_activities(
    category: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    community_id: Optional[str] = None,
    water_body_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve real-world activities with optional category or status filters."""
    query = db.query(Activity)
    if category:
        query = query.filter(Activity.category == category)
    if status_filter:
        query = query.filter(Activity.status == status_filter)
    if community_id:
        query = query.filter(Activity.community_id == community_id)
    if water_body_id:
        query = query.filter(Activity.water_body_id == water_body_id)
    return query.order_by(Activity.date.asc()).all()


@router.get("/geojson", response_model=GeoJSONFeatureCollection)
def get_activities_geojson(db: Session = Depends(get_db)):
    """Returns all activities formatted as GeoJSON FeatureCollection for Leaflet map markers."""
    items = db.query(Activity).all()

    def extractor(act: Activity):
        return {
            "title": act.title,
            "category": act.category,
            "status": act.status,
            "date": act.date,
            "time": act.time,
            "locationName": act.location_name,
            "participantCount": len(act.participants),
            "volunteerLimit": act.volunteer_limit,
            "isDemoData": act.is_demo_data,
        }

    return build_geojson_collection(items, extractor)


@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(activity_id: str, db: Session = Depends(get_db)):
    """Retrieve an activity by ID with participant roster and impact documentation."""
    act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    return act


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(
    payload: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Schedules a new community conservation activity with PostGIS location."""
    act_id = payload.id or f"act-{uuid.uuid4().hex[:8]}"
    point_geom = from_shape(Point(payload.longitude, payload.latitude), srid=4326)

    data = payload.model_dump(
        exclude={"id", "organizer_id", "organizer_name", "organizer_avatar"}
    )
    act = Activity(
        id=act_id,
        location_geom=point_geom,
        organizer_id=current_user.id,
        organizer_name=current_user.name,
        organizer_avatar=current_user.avatar,
        **data,
    )

    # Automatically enroll authenticated organizer as initial participant
    organizer_part = ActivityParticipation(
        id=f"ap-{uuid.uuid4().hex[:8]}",
        activity_id=act_id,
        user_id=current_user.id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        joined_at=datetime.now(timezone.utc),
    )

    db.add(act)
    db.add(organizer_part)
    db.commit()
    db.refresh(act)
    return act


@router.patch("/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: str,
    payload: ActivityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Updates activity details or transitions status. Restricted to organizer or lead."""
    act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")

    is_organizer = act.organizer_id == current_user.id
    is_lead = current_user.role in ("community_lead", "hydrologist")
    if not (is_organizer or is_lead):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the activity organizer or community leads can modify this event.",
        )

    update_dict = payload.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(act, key, value)

    db.commit()
    db.refresh(act)
    return act


@router.post("/{activity_id}/join", response_model=ActivityParticipationResponse, status_code=status.HTTP_201_CREATED)
def join_activity(
    activity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Signs up the authenticated user as a volunteer for an activity."""
    act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")

    existing = (
        db.query(ActivityParticipation)
        .filter(ActivityParticipation.activity_id == activity_id, ActivityParticipation.user_id == current_user.id)
        .first()
    )
    if existing:
        return existing

    part_id = f"ap-{uuid.uuid4().hex[:8]}"
    part = ActivityParticipation(
        id=part_id,
        activity_id=activity_id,
        user_id=current_user.id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        joined_at=datetime.now(timezone.utc),
    )

    db.add(part)
    db.commit()
    db.refresh(part)
    return part


@router.delete("/{activity_id}/join", status_code=status.HTTP_204_NO_CONTENT)
def leave_activity(
    activity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Removes the authenticated volunteer from the activity roster."""
    part = (
        db.query(ActivityParticipation)
        .filter(ActivityParticipation.activity_id == activity_id, ActivityParticipation.user_id == current_user.id)
        .first()
    )
    if part:
        db.delete(part)
        db.commit()
    return None


@router.get("/{activity_id}/impact", response_model=Optional[ActivityImpactResponse])
def get_activity_impact(activity_id: str, db: Session = Depends(get_db)):
    """Retrieves before/after documentation and verified impact of a completed activity."""
    impact = db.query(ActivityImpact).filter(ActivityImpact.activity_id == activity_id).first()
    return impact


@router.post("/{activity_id}/impact", response_model=ActivityImpactResponse, status_code=status.HTTP_201_CREATED)
def record_activity_impact(
    activity_id: str,
    payload: ActivityImpactCreate,
    db: Session = Depends(get_db),
):
    """Records before/after evidence and marks the activity as completed."""
    act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")

    # Mark parent activity completed
    act.status = "completed"

    impact = db.query(ActivityImpact).filter(ActivityImpact.activity_id == activity_id).first()
    if not impact:
        impact = ActivityImpact(
            id=f"ai-{uuid.uuid4().hex[:8]}",
            activity_id=activity_id,
            **payload.model_dump(),
            created_at=datetime.now(timezone.utc),
        )
        db.add(impact)
    else:
        for k, v in payload.model_dump().items():
            setattr(impact, k, v)

    db.commit()
    db.refresh(impact)
    return impact
