from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from database import Base


class EnvironmentalReport(Base):
    __tablename__ = "environmental_reports"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False, index=True)
    description = Column(Text, nullable=False)

    # Workflow Status: SUBMITTED -> UNDER_REVIEW -> VERIFIED -> RESOLVED
    status = Column(String(64), default="SUBMITTED", nullable=False, index=True)
    status_note = Column(Text, nullable=True)

    # Location Information
    location_name = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True)

    # Optional foreign key to related water body
    water_body_id = Column(String(64), ForeignKey("water_bodies.id", ondelete="SET NULL"), nullable=True, index=True)

    # Citizen submitter metadata
    submitted_by_user_id = Column(String(64), nullable=False, index=True)
    submitted_by_user_name = Column(String(150), nullable=False)
    submitted_by_user_avatar = Column(String(500), nullable=True)
    photo_url = Column(String(500), nullable=True)

    is_citizen_report = Column(Boolean, default=True, nullable=False)
    is_demo_data = Column(Boolean, default=True, nullable=False)
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    water_body = relationship("WaterBody", back_populates="reports")
