from typing import List, Optional
from pydantic import BaseModel


class ExplainReportRequest(BaseModel):
    title: str
    category: str
    description: str
    water_body_name: Optional[str] = None


class ExplainReportResponse(BaseModel):
    summary: str
    scientific_context: str
    immediate_actions: List[str]
    is_ai_analysis: bool = True
    disclaimer: str = (
        "AI-generated educational explanation based on provided citizen report. "
        "Not an official governmental or lab measurement."
    )


class HeatWaterSummaryRequest(BaseModel):
    city: str
    current_temp_c: float
    wet_bulb_temp_c: float
    water_table_depth_m: Optional[float] = None
    water_body_name: Optional[str] = None


class HeatWaterSummaryResponse(BaseModel):
    heat_water_nexus_explanation: str
    risk_level_interpretation: str
    community_cooling_recommendations: List[str]
    is_ai_analysis: bool = True
    disclaimer: str = "AI-generated educational summary based on regional parameters."
