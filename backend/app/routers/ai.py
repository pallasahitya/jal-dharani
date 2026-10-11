from fastapi import APIRouter
from app.schemas.ai import (
    ExplainReportRequest,
    ExplainReportResponse,
    HeatWaterSummaryRequest,
    HeatWaterSummaryResponse,
)
from app.services.gemini import explain_environmental_report, summarize_heat_water_nexus

router = APIRouter(prefix="/api/ai", tags=["AI Educational Assistant"])


@router.post("/explain-report", response_model=ExplainReportResponse)
def explain_report_endpoint(payload: ExplainReportRequest):
    """
    AI-powered educational assistant:
    Explains the scientific mechanism and immediate safety measures for an observed citizen report.
    Guaranteed not to fabricate chemical measurements.
    """
    result = explain_environmental_report(
        title=payload.title,
        category=payload.category,
        description=payload.description,
        water_body_name=payload.water_body_name or "",
    )
    return ExplainReportResponse(**result)


@router.post("/heat-water-summary", response_model=HeatWaterSummaryResponse)
def heat_water_summary_endpoint(payload: HeatWaterSummaryRequest):
    """
    AI-powered environmental summary:
    Explains the coupled heat-water nexus and recommends community cooling interventions.
    """
    result = summarize_heat_water_nexus(
        city=payload.city,
        temp_c=payload.current_temp_c,
        wet_bulb_c=payload.wet_bulb_temp_c,
        water_table_depth_m=payload.water_table_depth_m,
    )
    return HeatWaterSummaryResponse(**result)
