from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CommentBase(BaseModel):
    text: str


class CommentCreate(CommentBase):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None


class CommentResponse(CommentBase):
    id: str
    post_id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CommunityPostBase(BaseModel):
    content: str
    photo_url: Optional[str] = None


class CommunityPostCreate(CommunityPostBase):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None


class CommunityPostResponse(CommunityPostBase):
    id: str
    community_id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    likes_count: int
    created_at: datetime
    comments: List[CommentResponse] = []

    model_config = ConfigDict(from_attributes=True)


class CommunityMemberBase(BaseModel):
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    role: str = "volunteer"


class CommunityMemberResponse(CommunityMemberBase):
    id: str
    community_id: str
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CommunityBase(BaseModel):
    name: str
    tagline: str
    description: str
    focus_areas: List[str] = []
    city: str
    state: str
    latitude: float
    longitude: float
    water_body_id: Optional[str] = None


class CommunityCreate(CommunityBase):
    id: Optional[str] = None
    created_by_user_id: str
    photos: List[str] = []
    announcements: List[Dict[str, Any]] = []
    is_demo_data: bool = True


class CommunityResponse(CommunityBase):
    id: str
    created_by_user_id: str
    photos: List[str] = []
    announcements: List[Dict[str, Any]] = []
    is_demo_data: bool
    created_at: datetime
    updated_at: datetime

    members: List[CommunityMemberResponse] = []
    posts: List[CommunityPostResponse] = []

    model_config = ConfigDict(from_attributes=True)
