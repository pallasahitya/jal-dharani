import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from database import get_db
from app.models.heat_zone import HeatZone
from app.schemas.heat_zone import HeatZoneCreate, HeatZoneResponse
from app.schemas.geojson import GeoJSONFeatureCollection
from app.services.spatial import build_geojson_collection

router = APIRouter(prefix="/api/heat-zones", tags=["Heat Zones"])


@router.get("", response_model=List[HeatZoneResponse])
def get_heat_zones(
    city: Optional[str] = None,
    risk_level: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Retrieve all urban heat zones with optional city or risk filter."""
    query = db.query(HeatZone)
    if city:
        query = query.filter(func.lower(HeatZone.city).contains(city.lower()))
    if risk_level:
        query = query.filter(HeatZone.risk_level == risk_level)
    return query.all()


@router.get("/geojson", response_model=GeoJSONFeatureCollection)
def get_heat_zones_geojson(db: Session = Depends(get_db)):
    """Returns all heat zones formatted as GeoJSON FeatureCollection for Leaflet consumption."""
    items = db.query(HeatZone).all()

    def extractor(hz: HeatZone):
        return {
            "city": hz.city,
            "areaName": hz.area_name,
            "currentTempC": hz.current_temp_c,
            "feelsLikeC": hz.feels_like_c,
            "wetBulbTempC": hz.wet_bulb_temp_c,
            "riskLevel": hz.risk_level,
            "imdAlert": hz.imd_alert,
            "waterStressMultiplier": hz.water_stress_multiplier,
            "isDemoData": hz.is_demo_data,
        }

    return build_geojson_collection(items, extractor)


@router.get("/{heat_zone_id}", response_model=HeatZoneResponse)
def get_heat_zone(heat_zone_id: str, db: Session = Depends(get_db)):
    """Retrieve a heat zone by ID."""
    hz = db.query(HeatZone).filter(HeatZone.id == heat_zone_id).first()
    if not hz:
        raise HTTPException(status_code=404, detail="Heat zone not found")
    return hz


@router.post("", response_model=HeatZoneResponse, status_code=status.HTTP_201_CREATED)
def create_heat_zone(payload: HeatZoneCreate, db: Session = Depends(get_db)):
    """Creates a new heat zone with PostGIS spatial location."""
    hz_id = payload.id or f"hz-{uuid.uuid4().hex[:8]}"
    point_geom = from_shape(Point(payload.longitude, payload.latitude), srid=4326)

    data = payload.model_dump(exclude={"id"})
    hz = HeatZone(
        id=hz_id,
        location_geom=point_geom,
        **data,
    )

    db.add(hz)
    db.commit()
    db.refresh(hz)
    return hz
