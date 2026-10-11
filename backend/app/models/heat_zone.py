from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Boolean, DateTime, JSON
from geoalchemy2 import Geometry
from database import Base


class HeatZone(Base):
    __tablename__ = "heat_zones"

    id = Column(String(64), primary_key=True, index=True)
    city = Column(String(100), nullable=False, index=True)
    area_name = Column(String(255), nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # PostGIS Spatial Geometries with SRID 4326
    location_geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True)
    boundary_geom = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=True)

    # Thermal & Meteorological Attributes
    current_temp_c = Column(Float, nullable=False)
    feels_like_c = Column(Float, nullable=False)
    wet_bulb_temp_c = Column(Float, nullable=False)
    relative_humidity_percent = Column(Float, nullable=False)

    risk_level = Column(String(64), nullable=False, index=True)  # Normal, Moderate, High, Severe Heatwave
    imd_alert = Column(String(64), nullable=False)  # None, Yellow, Orange, Red
    urban_canopy_percent = Column(Float, nullable=False)
    impervious_surface_percent = Column(Float, nullable=False)
    water_stress_multiplier = Column(String(64), nullable=False)  # e.g., 2.5x Critical Surge
    peak_hours = Column(String(100), nullable=False)

    community_cooling_tips = Column(JSON, default=list)
    nearby_cooling_centres = Column(JSON, default=list)

    official_source = Column(String(255), nullable=False)
    is_demo_data = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
