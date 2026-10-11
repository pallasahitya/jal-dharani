from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Boolean, DateTime, JSON
from geoalchemy2 import Geometry
from database import Base


class Aquifer(Base):
    __tablename__ = "aquifers"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    hydrogeology_type = Column(String(100), nullable=False)  # Alluvial, Basaltic, Hard Rock / Crystalline, Sandstone
    region = Column(String(255), nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # PostGIS Spatial Geometries with SRID 4326
    location_geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True)
    boundary_geom = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=True)

    # Central Ground Water Board (CGWB) Classification
    cgwb_category = Column(String(64), nullable=False, index=True)  # Safe, Semi-Critical, Critical, Over-exploited
    water_table_depth_bgl_meters = Column(Float, nullable=False)
    ten_year_trend = Column(String(64), nullable=False)  # Rising, Stable, Declining, Rapidly Depleting
    trend_rate_meters_per_year = Column(Float, nullable=False)
    recharge_potential = Column(String(100), nullable=False)
    soil_infiltration_rate_mm_hr = Column(Float, nullable=False)

    safe_recharge_practices = Column(JSON, default=list)
    risks_and_warnings = Column(JSON, default=list)

    official_source = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    is_demo_data = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
