from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class EnvironmentalReportBase(BaseModel):
    title: str
    category: str
    description: str
    location_name: str
    city: str
    state: str
    latitude: float
    longitude: float
    water_body_id: Optional[str] = None
    photo_url: Optional[str] = None


class EnvironmentalReportCreate(EnvironmentalReportBase):
    id: Optional[str] = None
    submitted_by_user_id: str
    submitted_by_user_name: str
    submitted_by_user_avatar: Optional[str] = None
    status: str = "SUBMITTED"
    status_note: Optional[str] = None
    is_demo_data: bool = True


class EnvironmentalReportUpdate(BaseModel):
    status: Optional[str] = None
    status_note: Optional[str] = None


class EnvironmentalReportResponse(EnvironmentalReportBase):
    id: str
    status: str
    status_note: Optional[str] = None
    submitted_by_user_id: str
    submitted_by_user_name: str
    submitted_by_user_avatar: Optional[str] = None
    is_citizen_report: bool
    is_demo_data: bool
    submitted_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
