from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Boolean, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(64), primary_key=True, index=True)
    community_id = Column(String(64), ForeignKey("communities.id", ondelete="CASCADE"), nullable=False, index=True)
    water_body_id = Column(String(64), ForeignKey("water_bodies.id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(64), nullable=False, index=True)  # cleanup, groundwater-audit, rwh-maintenance, heat-shelter, education, documentation

    location_name = Column(String(255), nullable=False)
    location_address = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True)

    date = Column(String(32), nullable=False, index=True)
    time = Column(String(64), nullable=False)

    organizer_id = Column(String(64), nullable=False, index=True)
    organizer_name = Column(String(150), nullable=False)
    organizer_avatar = Column(String(500), nullable=True)

    volunteer_limit = Column(Integer, default=30, nullable=False)
    status = Column(String(32), default="upcoming", nullable=False, index=True)  # upcoming, in-progress, completed

    photos = Column(JSON, default=list)
    is_demo_data = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    community = relationship("Community", back_populates="activities")
    water_body = relationship("WaterBody", back_populates="activities")
    participants = relationship("ActivityParticipation", back_populates="activity", cascade="all, delete-orphan")
    impact = relationship("ActivityImpact", back_populates="activity", uselist=False, cascade="all, delete-orphan")


class ActivityParticipation(Base):
    __tablename__ = "activity_participations"

    id = Column(String(64), primary_key=True, index=True)
    activity_id = Column(String(64), ForeignKey("activities.id", ondelete="CASCADE"), nullable=False, index=True)

    user_id = Column(String(64), nullable=False, index=True)
    user_name = Column(String(150), nullable=False)
    user_avatar = Column(String(500), nullable=True)
    joined_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    activity = relationship("Activity", back_populates="participants")


class ActivityImpact(Base):
    __tablename__ = "activity_impacts"

    id = Column(String(64), primary_key=True, index=True)
    activity_id = Column(String(64), ForeignKey("activities.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    before_photo = Column(String(500), nullable=True)
    after_photo = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    impact_summary = Column(String(255), nullable=False)

    volunteers_attended = Column(Integer, default=0, nullable=False)
    waste_removed_kg = Column(Float, nullable=True)
    structures_maintained = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    activity = relationship("Activity", back_populates="impact")
