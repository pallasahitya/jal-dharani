from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class HeatZoneBase(BaseModel):
    city: str
    area_name: str
    latitude: float
    longitude: float
    current_temp_c: float
    feels_like_c: float
    wet_bulb_temp_c: float
    relative_humidity_percent: float
    risk_level: str
    imd_alert: str
    urban_canopy_percent: float
    impervious_surface_percent: float
    water_stress_multiplier: str
    peak_hours: str
    community_cooling_tips: List[str] = []
    nearby_cooling_centres: List[Dict[str, Any]] = []
    official_source: str


class HeatZoneCreate(HeatZoneBase):
    id: Optional[str] = None
    is_demo_data: bool = True


class HeatZoneResponse(HeatZoneBase):
    id: str
    is_demo_data: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
