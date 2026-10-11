import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from database import get_db
from app.models.user import User
from app.models.report import EnvironmentalReport
from app.dependencies.auth import get_current_user
from app.schemas.report import (
    EnvironmentalReportCreate,
    EnvironmentalReportUpdate,
    EnvironmentalReportResponse,
)
from app.schemas.geojson import GeoJSONFeatureCollection
from app.services.spatial import build_geojson_collection

router = APIRouter(prefix="/api/reports", tags=["Environmental Reports"])


@router.get("", response_model=List[EnvironmentalReportResponse])
def get_reports(
    category: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    water_body_id: Optional[str] = None,
    city: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve all citizen environmental reports with optional filters."""
    query = db.query(EnvironmentalReport)
    if category:
        query = query.filter(EnvironmentalReport.category == category)
    if status_filter:
        query = query.filter(EnvironmentalReport.status == status_filter)
    if water_body_id:
        query = query.filter(EnvironmentalReport.water_body_id == water_body_id)
    if city:
        query = query.filter(func.lower(EnvironmentalReport.city) == city.lower())
    return query.order_by(EnvironmentalReport.submitted_at.desc()).all()


@router.get("/geojson", response_model=GeoJSONFeatureCollection)
def get_reports_geojson(db: Session = Depends(get_db)):
    """Returns all citizen reports formatted as GeoJSON FeatureCollection for Leaflet."""
    items = db.query(EnvironmentalReport).all()

    def extractor(rep: EnvironmentalReport):
        return {
            "title": rep.title,
            "category": rep.category,
            "status": rep.status,
            "locationName": rep.location_name,
            "city": rep.city,
            "userName": rep.submitted_by_user_name,
            "photoUrl": rep.photo_url,
            "isCitizenReport": rep.is_citizen_report,
        }

    return build_geojson_collection(items, extractor)


@router.get("/{report_id}", response_model=EnvironmentalReportResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    """Retrieve an environmental report by ID."""
    rep = db.query(EnvironmentalReport).filter(EnvironmentalReport.id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Environmental report not found")
    return rep


@router.post("", response_model=EnvironmentalReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    payload: EnvironmentalReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Logs a new citizen environmental observation with PostGIS GPS location linked to authenticated user."""
    rep_id = payload.id or f"rep-{uuid.uuid4().hex[:8]}"
    point_geom = from_shape(Point(payload.longitude, payload.latitude), srid=4326)

    # Exclude client-supplied user fields to prevent identity spoofing
    data = payload.model_dump(
        exclude={"id", "submitted_by_user_id", "submitted_by_user_name", "submitted_by_user_avatar"}
    )
    rep = EnvironmentalReport(
        id=rep_id,
        location_geom=point_geom,
        submitted_by_user_id=current_user.id,
        submitted_by_user_name=current_user.name,
        submitted_by_user_avatar=current_user.avatar,
        **data,
    )

    db.add(rep)
    db.commit()
    db.refresh(rep)
    return rep


@router.patch("/{report_id}", response_model=EnvironmentalReportResponse)
def update_report_status(
    report_id: str,
    payload: EnvironmentalReportUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Updates the workflow status of an environmental report:
    SUBMITTED -> UNDER_REVIEW -> VERIFIED -> RESOLVED.
    Authorized for community leads, hydrologists, or the original submitter.
    """
    rep = db.query(EnvironmentalReport).filter(EnvironmentalReport.id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Environmental report not found")

    # Check permission
    is_author = rep.submitted_by_user_id == current_user.id
    is_moderator = current_user.role in ("community_lead", "hydrologist")
    if not (is_author or is_moderator):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this report's review status.",
        )

    if payload.status:
        rep.status = payload.status
    if payload.status_note is not None:
        rep.status_note = payload.status_note

    db.commit()
    db.refresh(rep)
    return rep
