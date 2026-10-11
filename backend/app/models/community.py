from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Boolean, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from database import Base


class Community(Base):
    __tablename__ = "communities"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    tagline = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    focus_areas = Column(JSON, default=list)  # water-body, groundwater, heat-resilience, rainwater-harvesting, pollution-cleanup

    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False, index=True)

    # Optional linked water body
    water_body_id = Column(String(64), ForeignKey("water_bodies.id", ondelete="SET NULL"), nullable=True, index=True)

    created_by_user_id = Column(String(64), nullable=False, index=True)
    photos = Column(JSON, default=list)
    announcements = Column(JSON, default=list)

    is_demo_data = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    water_body = relationship("WaterBody", back_populates="communities")
    members = relationship("CommunityMember", back_populates="community", cascade="all, delete-orphan")
    posts = relationship("CommunityPost", back_populates="community", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="community")


class CommunityMember(Base):
    __tablename__ = "community_members"

    id = Column(String(64), primary_key=True, index=True)
    community_id = Column(String(64), ForeignKey("communities.id", ondelete="CASCADE"), nullable=False, index=True)

    user_id = Column(String(64), nullable=False, index=True)
    user_name = Column(String(150), nullable=False)
    user_avatar = Column(String(500), nullable=True)
    role = Column(String(32), default="volunteer", nullable=False)  # admin, moderator, volunteer
    joined_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    community = relationship("Community", back_populates="members")


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(String(64), primary_key=True, index=True)
    community_id = Column(String(64), ForeignKey("communities.id", ondelete="CASCADE"), nullable=False, index=True)

    user_id = Column(String(64), nullable=False, index=True)
    user_name = Column(String(150), nullable=False)
    user_avatar = Column(String(500), nullable=True)

    content = Column(Text, nullable=False)
    photo_url = Column(String(500), nullable=True)
    likes_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    community = relationship("Community", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "post_comments"

    id = Column(String(64), primary_key=True, index=True)
    post_id = Column(String(64), ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False, index=True)

    user_id = Column(String(64), nullable=False, index=True)
    user_name = Column(String(150), nullable=False)
    user_avatar = Column(String(500), nullable=True)

    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    post = relationship("CommunityPost", back_populates="comments")
