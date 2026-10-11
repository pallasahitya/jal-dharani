from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ActivityParticipationBase(BaseModel):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None


class ActivityParticipationResponse(ActivityParticipationBase):
    id: str
    activity_id: str
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ActivityImpactBase(BaseModel):
    before_photo: Optional[str] = None
    after_photo: Optional[str] = None
    description: str
    impact_summary: str
    volunteers_attended: int = 0
    waste_removed_kg: Optional[float] = None
    structures_maintained: Optional[int] = None


class ActivityImpactCreate(ActivityImpactBase):
    pass


class ActivityImpactResponse(ActivityImpactBase):
    id: str
    activity_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ActivityBase(BaseModel):
    community_id: str
    water_body_id: Optional[str] = None
    title: str
    description: str
    category: str
    location_name: str
    location_address: str
    latitude: float
    longitude: float
    date: str
    time: str
    volunteer_limit: int = 30


class ActivityCreate(ActivityBase):
    id: Optional[str] = None
    organizer_id: str
    organizer_name: str
    organizer_avatar: Optional[str] = None
    status: str = "upcoming"
    photos: List[str] = []
    is_demo_data: bool = True


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    volunteer_limit: Optional[int] = None


class ActivityResponse(ActivityBase):
    id: str
    organizer_id: str
    organizer_name: str
    organizer_avatar: Optional[str] = None
    status: str
    photos: List[str] = []
    is_demo_data: bool
    created_at: datetime
    updated_at: datetime

    participants: List[ActivityParticipationResponse] = []
    impact: Optional[ActivityImpactResponse] = None

    model_config = ConfigDict(from_attributes=True)
