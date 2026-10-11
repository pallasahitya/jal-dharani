import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from app.models.user import User
from app.schemas.user import UserSignup, UserLogin, UserResponse, TokenResponse
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    build_user_response,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    JWT_ALGORITHM,
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    """
    Registers a new citizen or volunteer account with secure password hashing
    and returns an authenticated session token.
    """
    normalized_email = payload.email.strip().lower()

    # Reject duplicate email registrations
    existing_user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in instead.",
        )

    user_id = f"usr-{uuid.uuid4().hex[:10]}"
    password_hash = hash_password(payload.password)

    new_user = User(
        id=user_id,
        email=normalized_email,
        password_hash=password_hash,
        name=payload.name.strip(),
        avatar=payload.avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={user_id}",
        role=payload.role or "citizen",
        city=payload.city or "Pune",
        state=payload.state or "Maharashtra",
        neighborhood=payload.neighborhood,
        bio=payload.bio or "",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "sub": new_user.id,
        "email": new_user.email,
        "role": new_user.role,
        "name": new_user.name,
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=build_user_response(new_user),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates user credentials and issues a signed JWT access token.
    Protects against account enumeration by providing generic credential errors.
    """
    normalized_email = payload.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials and try again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.name,
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=build_user_response(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Retrieves the currently authenticated user's profile and impact metrics.
    """
    return build_user_response(current_user)


@router.get("/health")
def auth_health():
    """
    Verifies that the authentication configuration is active without exposing any secret keys.
    """
    return {
        "status": "healthy",
        "service": "Jal-Dharani JWT Authentication",
        "algorithm": JWT_ALGORITHM,
        "token_expiration_minutes": ACCESS_TOKEN_EXPIRE_MINUTES,
    }
