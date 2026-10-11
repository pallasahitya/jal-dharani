import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, SessionLocal
from app.seed.seed_data import seed_database
from app.routers import (
    auth_router,
    water_bodies_router,
    aquifers_router,
    heat_zones_router,
    reports_router,
    communities_router,
    activities_router,
    ai_router,
    health_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup & shutdown events:
    Ensures PostGIS tables exist and seeds development datasets if empty.
    """
    try:
        init_db()
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    except Exception as e:
        print(f"[Database Startup Notice]: {e}")
        print("Backend starting in resilient mode. Ensure PostgreSQL/PostGIS is running at DATABASE_URL.")
    yield


app = FastAPI(
    title="Jal-Dharani Backend API",
    description=(
        "Community-Driven Heat and Water Resilience Platform for India. "
        "Provides PostGIS spatial queries, environmental water bodies, aquifers, "
        "urban heat zones, citizen reporting workflows, community hubs, and Gemini AI assistance."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for local React frontend and preview environments
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all REST routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(water_bodies_router)
app.include_router(aquifers_router)
app.include_router(heat_zones_router)
app.include_router(reports_router)
app.include_router(communities_router)
app.include_router(activities_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Jal-Dharani Backend API",
        "documentation": "/docs",
        "health": "/api/health",
        "spatial_endpoints": [
            "/api/water-bodies/nearby?lat=19.99&lng=73.78&radius=50000",
            "/api/water-bodies/geojson",
            "/api/aquifers/geojson",
            "/api/heat-zones/geojson",
            "/api/reports/geojson",
        ],
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
