from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


class UserLocation(BaseModel):
    city: str = "Pune"
    state: str = "Maharashtra"
    neighborhood: Optional[str] = None


class UserImpactMetrics(BaseModel):
    volunteerHours: int = 0
    activitiesJoined: int = 0
    activitiesOrganized: int = 0
    reportsSubmitted: int = 0
    reportsVerified: int = 0
    waterBodiesMonitored: int = 0


class UserSignup(BaseModel):
    email: EmailStr = Field(..., description="Valid unique email address")
    password: str = Field(..., min_length=8, max_length=128, description="Password of at least 8 characters")
    name: str = Field(..., min_length=2, max_length=150, description="Full display name")
    avatar: Optional[str] = Field(None, description="Optional profile photo URL")
    city: Optional[str] = Field("Pune", max_length=100)
    state: Optional[str] = Field("Maharashtra", max_length=100)
    neighborhood: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field("", max_length=1000)
    role: Optional[str] = Field("citizen", description="Role: citizen or volunteer only for public registration")

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("role")
    @classmethod
    def validate_public_role(cls, v: Optional[str]) -> str:
        allowed = {"citizen", "volunteer"}
        if v and v.lower() not in allowed:
            # Prevent privilege escalation during public registration
            return "citizen"
        return v.lower() if v else "citizen"


class UserLogin(BaseModel):
    email: str = Field(..., description="Registered email address")
    password: str = Field(..., min_length=1, description="Account password")

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar: Optional[str] = None
    role: str
    city: str
    state: str
    neighborhood: Optional[str] = None
    bio: Optional[str] = ""
    created_at: datetime
    location: Optional[UserLocation] = None
    impactMetrics: Optional[UserImpactMetrics] = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse
