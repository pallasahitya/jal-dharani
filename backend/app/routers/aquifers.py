import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from database import get_db
from app.models.aquifer import Aquifer
from app.schemas.aquifer import AquiferCreate, AquiferResponse
from app.schemas.geojson import GeoJSONFeatureCollection
from app.services.spatial import build_geojson_collection

router = APIRouter(prefix="/api/aquifers", tags=["Aquifers"])


@router.get("", response_model=List[AquiferResponse])
def get_aquifers(db: Session = Depends(get_db)):
    """Retrieve all regional aquifers."""
    return db.query(Aquifer).all()


@router.get("/geojson", response_model=GeoJSONFeatureCollection)
def get_aquifers_geojson(db: Session = Depends(get_db)):
    """Returns all aquifers formatted as GeoJSON FeatureCollection for Leaflet consumption."""
    items = db.query(Aquifer).all()

    def extractor(aq: Aquifer):
        return {
            "name": aq.name,
            "hydrogeologyType": aq.hydrogeology_type,
            "region": aq.region,
            "cgwbCategory": aq.cgwb_category,
            "waterTableDepthBglMeters": aq.water_table_depth_bgl_meters,
            "tenYearTrend": aq.ten_year_trend,
            "rechargePotential": aq.recharge_potential,
            "isDemoData": aq.is_demo_data,
        }

    return build_geojson_collection(items, extractor)


@router.get("/{aquifer_id}", response_model=AquiferResponse)
def get_aquifer(aquifer_id: str, db: Session = Depends(get_db)):
    """Retrieve an aquifer by ID."""
    aq = db.query(Aquifer).filter(Aquifer.id == aquifer_id).first()
    if not aq:
        raise HTTPException(status_code=404, detail="Aquifer not found")
    return aq


@router.post("", response_model=AquiferResponse, status_code=status.HTTP_201_CREATED)
def create_aquifer(payload: AquiferCreate, db: Session = Depends(get_db)):
    """Creates a new aquifer record with PostGIS spatial geometry."""
    aq_id = payload.id or f"aq-{uuid.uuid4().hex[:8]}"
    point_geom = from_shape(Point(payload.longitude, payload.latitude), srid=4326)

    data = payload.model_dump(exclude={"id"})
    aq = Aquifer(
        id=aq_id,
        location_geom=point_geom,
        **data,
    )

    db.add(aq)
    db.commit()
    db.refresh(aq)
    return aq
