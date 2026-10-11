from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel


class GeoJSONGeometry(BaseModel):
    type: Literal["Point", "Polygon", "MultiPolygon", "LineString"]
    coordinates: Any


class GeoJSONFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    id: Optional[str] = None
    geometry: GeoJSONGeometry
    properties: Dict[str, Any]


class GeoJSONFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: List[GeoJSONFeature]
