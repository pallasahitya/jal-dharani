from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db

router = APIRouter(prefix="/api/health", tags=["Health"])


@router.get("")
def health_check(db: Session = Depends(get_db)):
    """Health check verifying database connectivity and PostGIS status."""
    try:
        # Check PostGIS extension version
        result = db.execute(text("SELECT PostGIS_Version();")).fetchone()
        postgis_version = result[0] if result else "Unknown"
        return {
            "status": "healthy",
            "service": "Jal-Dharani Backend API",
            "database": "connected",
            "postgis": postgis_version,
        }
    except Exception as e:
        return {
            "status": "degraded",
            "service": "Jal-Dharani Backend API",
            "database": "disconnected",
            "error": str(e),
        }
