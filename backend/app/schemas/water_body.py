from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ObservationBase(BaseModel):
    category: str
    note: str
    photo_url: Optional[str] = None


class ObservationCreate(ObservationBase):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None


class ObservationResponse(ObservationBase):
    id: str
    water_body_id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    is_citizen_report: bool
    observed_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WaterQualityOfficialSchema(BaseModel):
    dissolvedOxygenMgL: Optional[float] = None
    ph: Optional[float] = None
    bodMgL: Optional[float] = None
    tdsMgL: Optional[float] = None
    turbidityNtu: Optional[float] = None
    officialSource: Optional[str] = None
    complianceStatus: Optional[str] = None
    lastUpdated: Optional[str] = None


class PollutionDetailsSchema(BaseModel):
    severity: Optional[str] = None
    primaryPollutants: List[str] = []
    summary: Optional[str] = None


class WaterBodyBase(BaseModel):
    name: str
    local_name: Optional[str] = None
    type: str
    city: str
    state: str
    basin: str
    latitude: float
    longitude: float
    description: str
    historical_context: Optional[str] = None


class WaterBodyCreate(WaterBodyBase):
    id: Optional[str] = None
    dissolved_oxygen_mg_l: Optional[float] = None
    ph: Optional[float] = None
    bod_mg_l: Optional[float] = None
    tds_mg_l: Optional[float] = None
    turbidity_ntu: Optional[float] = None
    official_source: Optional[str] = None
    compliance_status: Optional[str] = None
    quality_last_updated: Optional[str] = None
    pollution_severity: Optional[str] = None
    primary_pollutants: List[str] = []
    pollution_summary: Optional[str] = None
    photos: List[str] = []
    is_demo_data: bool = True


class WaterBodyResponse(WaterBodyBase):
    id: str
    dissolved_oxygen_mg_l: Optional[float] = None
    ph: Optional[float] = None
    bod_mg_l: Optional[float] = None
    tds_mg_l: Optional[float] = None
    turbidity_ntu: Optional[float] = None
    official_source: Optional[str] = None
    compliance_status: Optional[str] = None
    quality_last_updated: Optional[str] = None
    pollution_severity: Optional[str] = None
    primary_pollutants: List[str] = []
    pollution_summary: Optional[str] = None
    photos: List[str] = []
    is_demo_data: bool
    created_at: datetime
    updated_at: datetime

    # Nested observations
    observations: List[ObservationResponse] = []

    model_config = ConfigDict(from_attributes=True)
