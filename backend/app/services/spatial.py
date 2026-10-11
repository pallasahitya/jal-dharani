from typing import Any, Callable, Dict, List
from sqlalchemy import func
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKBElement
from shapely import from_wkb
from app.models.water_body import WaterBody
from app.schemas.geojson import GeoJSONFeature, GeoJSONFeatureCollection, GeoJSONGeometry


def point_to_geojson_geometry(lat: float, lng: float) -> GeoJSONGeometry:
    """Creates a GeoJSON Point geometry from latitude and longitude."""
    return GeoJSONGeometry(
        type="Point",
        coordinates=[lng, lat],  # GeoJSON standard is [longitude, latitude]
    )


def build_geojson_collection(
    items: List[Any],
    property_extractor: Callable[[Any], Dict[str, Any]],
) -> GeoJSONFeatureCollection:
    """Converts a list of ORM objects with lat/lng into a GeoJSON FeatureCollection."""
    features: List[GeoJSONFeature] = []
    for item in items:
        lat = getattr(item, "latitude", None)
        lng = getattr(item, "longitude", None)
        item_id = str(getattr(item, "id", ""))

        if lat is not None and lng is not None:
            features.append(
                GeoJSONFeature(
                    id=item_id,
                    geometry=point_to_geojson_geometry(lat, lng),
                    properties=property_extractor(item),
                )
            )

    return GeoJSONFeatureCollection(features=features)


def query_nearby_water_bodies(
    db: Session,
    latitude: float,
    longitude: float,
    radius_meters: float = 50000.0,
    limit: int = 20,
) -> List[WaterBody]:
    """
    Performs an authoritative PostGIS spatial query using ST_DWithin on a spherical geography projection.
    Finds water bodies within radius_meters of the given GPS coordinate (SRID 4326).
    """
    # Point created in WGS 84 (SRID 4326), cast to geography for accurate meter-based distance calculation
    point_geom = func.ST_SetSRID(func.ST_MakePoint(longitude, latitude), 4326)

    query = (
        db.query(WaterBody)
        .filter(
            func.ST_DWithin(
                func.cast(WaterBody.location_geom, func.geography),
                func.cast(point_geom, func.geography),
                radius_meters,
            )
        )
        .order_by(
            func.ST_Distance(
                func.cast(WaterBody.location_geom, func.geography),
                func.cast(point_geom, func.geography),
            )
        )
        .limit(limit)
    )

    return query.all()
