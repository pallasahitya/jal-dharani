from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from database import Base


class WaterBody(Base):
    __tablename__ = "water_bodies"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    local_name = Column(String(255), nullable=True)
    type = Column(String(64), nullable=False, index=True)  # river, lake, pond, canal, stepwell, wetland

    # Geographic attributes
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    basin = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # PostGIS Spatial Geometry with SRID 4326 (WGS 84 GPS coordinates)
    location_geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True)
    boundary_geom = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=True)

    description = Column(Text, nullable=False)
    historical_context = Column(Text, nullable=True)

    # Official Environmental & Water Quality Data (CPCB / NWMP / WRIS)
    dissolved_oxygen_mg_l = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    bod_mg_l = Column(Float, nullable=True)
    tds_mg_l = Column(Float, nullable=True)
    turbidity_ntu = Column(Float, nullable=True)
    official_source = Column(String(255), nullable=True)
    compliance_status = Column(String(64), nullable=True)  # Satisfactory, Moderate Concern, Severe Degradation
    quality_last_updated = Column(String(64), nullable=True)

    # Pollution Details
    pollution_severity = Column(String(64), nullable=True)  # Low, Moderate, High, Critical
    primary_pollutants = Column(JSON, default=list)  # List of primary pollutants
    pollution_summary = Column(Text, nullable=True)

    # Media and Metadata
    photos = Column(JSON, default=list)  # List of photo URLs
    is_demo_data = Column(Boolean, default=True, nullable=False)  # Clearly distinguishes reliable vs demo data
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    observations = relationship("Observation", back_populates="water_body", cascade="all, delete-orphan")
    reports = relationship("EnvironmentalReport", back_populates="water_body")
    communities = relationship("Community", back_populates="water_body")
    activities = relationship("Activity", back_populates="water_body")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(String(64), primary_key=True, index=True)
    water_body_id = Column(String(64), ForeignKey("water_bodies.id", ondelete="CASCADE"), nullable=False, index=True)

    user_id = Column(String(64), nullable=False, index=True)
    user_name = Column(String(150), nullable=False)
    user_avatar = Column(String(500), nullable=True)

    category = Column(String(64), nullable=False)  # algal-bloom, plastic-waste, water-clarity, wildlife-sighting, low-flow, foaming
    note = Column(Text, nullable=False)
    photo_url = Column(String(500), nullable=True)

    is_citizen_report = Column(Boolean, default=True, nullable=False)
    observed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    water_body = relationship("WaterBody", back_populates="observations")
