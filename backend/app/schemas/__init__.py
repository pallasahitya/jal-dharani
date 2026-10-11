from app.schemas.user import (
    UserSignup,
    UserLogin,
    UserResponse,
    TokenResponse,
    UserLocation,
    UserImpactMetrics,
)
from app.schemas.water_body import (
    WaterBodyCreate,
    WaterBodyResponse,
    ObservationCreate,
    ObservationResponse,
)
from app.schemas.aquifer import AquiferCreate, AquiferResponse
from app.schemas.heat_zone import HeatZoneCreate, HeatZoneResponse
from app.schemas.report import (
    EnvironmentalReportCreate,
    EnvironmentalReportUpdate,
    EnvironmentalReportResponse,
)
from app.schemas.community import (
    CommunityCreate,
    CommunityResponse,
    CommunityMemberResponse,
    CommunityPostCreate,
    CommunityPostResponse,
    CommentCreate,
    CommentResponse,
)
from app.schemas.activity import (
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    ActivityParticipationResponse,
    ActivityImpactCreate,
    ActivityImpactResponse,
)
from app.schemas.geojson import (
    GeoJSONGeometry,
    GeoJSONFeature,
    GeoJSONFeatureCollection,
)
from app.schemas.ai import (
    ExplainReportRequest,
    ExplainReportResponse,
    HeatWaterSummaryRequest,
    HeatWaterSummaryResponse,
)

__all__ = [
    "WaterBodyCreate",
    "WaterBodyResponse",
    "ObservationCreate",
    "ObservationResponse",
    "AquiferCreate",
    "AquiferResponse",
    "HeatZoneCreate",
    "HeatZoneResponse",
    "EnvironmentalReportCreate",
    "EnvironmentalReportUpdate",
    "EnvironmentalReportResponse",
    "CommunityCreate",
    "CommunityResponse",
    "CommunityMemberResponse",
    "CommunityPostCreate",
    "CommunityPostResponse",
    "CommentCreate",
    "CommentResponse",
    "ActivityCreate",
    "ActivityUpdate",
    "ActivityResponse",
    "ActivityParticipationResponse",
    "ActivityImpactCreate",
    "ActivityImpactResponse",
    "GeoJSONGeometry",
    "GeoJSONFeature",
    "GeoJSONFeatureCollection",
    "ExplainReportRequest",
    "ExplainReportResponse",
    "HeatWaterSummaryRequest",
    "HeatWaterSummaryResponse",
]
