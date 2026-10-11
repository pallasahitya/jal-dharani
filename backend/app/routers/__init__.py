from app.routers.auth import router as auth_router
from app.routers.water_bodies import router as water_bodies_router
from app.routers.aquifers import router as aquifers_router
from app.routers.heat_zones import router as heat_zones_router
from app.routers.reports import router as reports_router
from app.routers.communities import router as communities_router
from app.routers.activities import router as activities_router
from app.routers.ai import router as ai_router
from app.routers.health import router as health_router

__all__ = [
    "auth_router",
    "water_bodies_router",
    "aquifers_router",
    "heat_zones_router",
    "reports_router",
    "communities_router",
    "activities_router",
    "ai_router",
    "health_router",
]
