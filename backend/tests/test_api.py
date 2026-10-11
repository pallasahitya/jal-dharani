import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from main import app
from app.schemas.geojson import GeoJSONFeatureCollection, GeoJSONFeature, GeoJSONGeometry
from app.services.spatial import point_to_geojson_geometry, build_geojson_collection
from app.schemas.water_body import WaterBodyCreate, WaterBodyResponse
from app.schemas.report import EnvironmentalReportCreate

client = TestClient(app)


def test_root_endpoint():
    """Verify root endpoint responds with API metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Jal-Dharani Backend API" in data["message"]
    assert "/docs" in data["documentation"]


def test_health_endpoint():
    """Verify health endpoint responds without crash even if DB is offline."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data


def test_ai_explain_report_deterministic_fallback():
    """Verify Gemini AI explanation service works with deterministic scientific fallback."""
    payload = {
        "title": "Foaming at lake weir",
        "category": "foaming",
        "description": "Thick detergent white foam observed along spillway.",
        "water_body_name": "Bellandur Lake",
    }
    response = client.post("/api/ai/explain-report", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "foaming" in data["summary"].lower()
    assert len(data["immediate_actions"]) > 0
    assert "scientific_context" in data


def test_ai_heat_water_summary():
    """Verify heat-water coupled summary endpoint responds with scientific context."""
    payload = {
        "city": "Nagpur",
        "current_temp_c": 44.0,
        "wet_bulb_temp_c": 29.0,
        "water_table_depth_m": 15.0,
    }
    response = client.post("/api/ai/heat-water-summary", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "heat_water_nexus_explanation" in data
    assert len(data["community_cooling_recommendations"]) > 0
    assert "risk_level_interpretation" in data


def test_point_to_geojson_geometry():
    """Verify PostGIS lat/lng converts to GeoJSON [lng, lat] coordinate standards."""
    lat, lng = 18.5284, 73.8743
    geom = point_to_geojson_geometry(lat, lng)
    assert geom.type == "Point"
    assert geom.coordinates == [73.8743, 18.5284]  # GeoJSON is [longitude, latitude]


def test_build_geojson_collection():
    """Verify build_geojson_collection produces a valid FeatureCollection."""
    class MockItem:
        id = "mock-1"
        latitude = 18.5
        longitude = 73.8
        name = "Mock Lake"

    collection = build_geojson_collection([MockItem()], lambda item: {"name": item.name})
    assert collection.type == "FeatureCollection"
    assert len(collection.features) == 1
    assert collection.features[0].id == "mock-1"
    assert collection.features[0].properties["name"] == "Mock Lake"
    assert collection.features[0].geometry.coordinates == [73.8, 18.5]


def test_water_body_create_schema_validation():
    """Verify WaterBodyCreate schema validates required fields."""
    wb_data = {
        "name": "Mula River",
        "type": "river",
        "city": "Pune",
        "state": "Maharashtra",
        "basin": "Krishna Basin",
        "latitude": 18.55,
        "longitude": 73.82,
        "description": "Urban river segment.",
    }
    wb = WaterBodyCreate(**wb_data)
    assert wb.name == "Mula River"
    assert wb.latitude == 18.55
    assert wb.is_demo_data is True


def test_report_create_schema_validation():
    """Verify EnvironmentalReportCreate schema validates citizen submissions."""
    report_data = {
        "title": "Industrial Effluent Discharge",
        "category": "sewage-inflow",
        "description": "Discolored effluent observed entering channel.",
        "location_name": "Bridge Point",
        "city": "Pune",
        "state": "Maharashtra",
        "latitude": 18.52,
        "longitude": 73.85,
        "submitted_by_user_id": "u-101",
        "submitted_by_user_name": "Aarav Sharma",
    }
    rep = EnvironmentalReportCreate(**report_data)
    assert rep.title == "Industrial Effluent Discharge"
    assert rep.status == "SUBMITTED"
    assert rep.submitted_by_user_id == "u-101"
