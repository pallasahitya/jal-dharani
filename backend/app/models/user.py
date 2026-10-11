from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(150), nullable=False)
    avatar = Column(String(500), nullable=True)

    # Role options: 'citizen', 'volunteer', 'community_lead', 'hydrologist'
    role = Column(String(32), default="citizen", nullable=False)

    # Geographic location
    city = Column(String(100), default="Pune", nullable=False, index=True)
    state = Column(String(100), default="Maharashtra", nullable=False, index=True)
    neighborhood = Column(String(100), nullable=True)

    bio = Column(Text, nullable=True, default="")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
