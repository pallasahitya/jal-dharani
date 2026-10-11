import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from database import get_db
from app.models.user import User
from app.models.water_body import WaterBody, Observation
from app.dependencies.auth import get_current_user
from app.schemas.water_body import (
    WaterBodyCreate,
    WaterBodyResponse,
    ObservationCreate,
    ObservationResponse,
)
from app.schemas.geojson import GeoJSONFeatureCollection
from app.services.spatial import query_nearby_water_bodies, build_geojson_collection

router = APIRouter(prefix="/api/water-bodies", tags=["Water Bodies"])


@router.get("", response_model=List[WaterBodyResponse])
def get_water_bodies(
    city: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve all surface water bodies with optional filtering."""
    query = db.query(WaterBody)
    if city:
        query = query.filter(func.lower(WaterBody.city) == city.lower())
    if type:
        query = query.filter(func.lower(WaterBody.type) == type.lower())
    return query.all()


@router.get("/nearby", response_model=List[WaterBodyResponse])
def get_nearby_water_bodies(
    lat: float = Query(..., description="User latitude in degrees (WGS 84)"),
    lng: float = Query(..., description="User longitude in degrees (WGS 84)"),
    radius: float = Query(50000.0, description="Search radius in meters (default 50 km)"),
    limit: int = Query(20, description="Max results"),
    db: Session = Depends(get_db),
):
    """
    Authoritative PostGIS spatial query:
    Finds water bodies within the specified radius of given GPS coordinates.
    """
    return query_nearby_water_bodies(db, latitude=lat, longitude=lng, radius_meters=radius, limit=limit)


@router.get("/geojson", response_model=GeoJSONFeatureCollection)
def get_water_bodies_geojson(db: Session = Depends(get_db)):
    """Returns all water bodies formatted as a GeoJSON FeatureCollection for Leaflet consumption."""
    items = db.query(WaterBody).all()

    def extractor(wb: WaterBody):
        return {
            "name": wb.name,
            "localName": wb.local_name,
            "type": wb.type,
            "city": wb.city,
            "state": wb.state,
            "basin": wb.basin,
            "complianceStatus": wb.compliance_status,
            "dissolvedOxygenMgL": wb.dissolved_oxygen_mg_l,
            "bodMgL": wb.bod_mg_l,
            "isDemoData": wb.is_demo_data,
        }

    return build_geojson_collection(items, extractor)


@router.get("/{water_body_id}", response_model=WaterBodyResponse)
def get_water_body(water_body_id: str, db: Session = Depends(get_db)):
    """Retrieve a single water body by ID."""
    wb = db.query(WaterBody).filter(WaterBody.id == water_body_id).first()
    if not wb:
        raise HTTPException(status_code=404, detail="Water body not found")
    return wb


@router.post("", response_model=WaterBodyResponse, status_code=status.HTTP_201_CREATED)
def create_water_body(payload: WaterBodyCreate, db: Session = Depends(get_db)):
    """Creates a new surface water body with PostGIS spatial point."""
    wb_id = payload.id or f"wb-{uuid.uuid4().hex[:8]}"

    # PostGIS Point in SRID 4326 (longitude, latitude)
    point_geom = from_shape(Point(payload.longitude, payload.latitude), srid=4326)

    data = payload.model_dump(exclude={"id"})
    wb = WaterBody(
        id=wb_id,
        location_geom=point_geom,
        **data,
    )

    db.add(wb)
    db.commit()
    db.refresh(wb)
    return wb


@router.post("/{water_body_id}/observations", response_model=ObservationResponse, status_code=status.HTTP_201_CREATED)
def add_observation(
    water_body_id: str,
    payload: ObservationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submits a citizen field observation attached to a specific water body."""
    wb = db.query(WaterBody).filter(WaterBody.id == water_body_id).first()
    if not wb:
        raise HTTPException(status_code=404, detail="Water body not found")

    obs_id = f"obs-{uuid.uuid4().hex[:8]}"
    data = payload.model_dump(exclude={"id", "user_id", "user_name", "user_avatar"})
    obs = Observation(
        id=obs_id,
        water_body_id=water_body_id,
        user_id=current_user.id,
        user_name=current_user.name,
        user_avatar=current_user.avatar,
        **data,
    )

    db.add(obs)
    db.commit()
    db.refresh(obs)
    return obs
