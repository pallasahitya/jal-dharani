from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AquiferBase(BaseModel):
    name: str
    hydrogeology_type: str
    region: str
    latitude: float
    longitude: float
    cgwb_category: str
    water_table_depth_bgl_meters: float
    ten_year_trend: str
    trend_rate_meters_per_year: float
    recharge_potential: str
    soil_infiltration_rate_mm_hr: float
    safe_recharge_practices: List[str] = []
    risks_and_warnings: List[str] = []
    official_source: str
    description: str


class AquiferCreate(AquiferBase):
    id: Optional[str] = None
    is_demo_data: bool = True


class AquiferResponse(AquiferBase):
    id: str
    is_demo_data: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
