import pytest
from datetime import timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from database import get_db, Base
from app.models.user import User
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

# Isolated In-Memory SQLite Engine for Testing
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create only User table in SQLite test database
User.__table__.create(bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_db():
    """Ensure clean user table before each test run."""
    db = TestingSessionLocal()
    db.query(User).delete()
    db.commit()
    db.close()
    yield


# ============================================================================
# 1. PASSWORD HASHING & VERIFICATION TESTS
# ============================================================================

def test_password_hashing_and_verification():
    """Verify that password hashing uses unique salts and verifies correctly."""
    raw_pass = "SecurePass2026!"
    hashed = hash_password(raw_pass)

    assert hashed != raw_pass
    assert len(hashed) > 20

    # Verification passes with correct password
    assert verify_password(raw_pass, hashed) is True

    # Verification fails with wrong password
    assert verify_password("WrongPassword!", hashed) is False
    assert verify_password("", hashed) is False

    # Two hashes of the same password produce distinct salt hashes
    hashed_second = hash_password(raw_pass)
    assert hashed != hashed_second
    assert verify_password(raw_pass, hashed_second) is True


# ============================================================================
# 2. JWT TOKEN CREATION, DECODING & EXPIRATION TESTS
# ============================================================================

def test_jwt_creation_and_decoding():
    """Verify that JWT creation signs claims and decodes accurately."""
    payload = {"sub": "usr-test-1", "email": "test@jal-dharani.org", "role": "citizen"}
    token = create_access_token(payload)

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "usr-test-1"
    assert decoded["email"] == "test@jal-dharani.org"
    assert decoded["role"] == "citizen"
    assert "exp" in decoded


def test_jwt_tamper_rejection():
    """Verify that tampered tokens are rejected."""
    payload = {"sub": "usr-test-1", "email": "test@jal-dharani.org", "role": "citizen"}
    token = create_access_token(payload)

    # Tamper with the token string
    tampered = token[:-4] + "abcd"
    assert decode_access_token(tampered) is None


def test_jwt_expiration():
    """Verify that expired tokens return None."""
    payload = {"sub": "usr-test-1", "email": "test@jal-dharani.org"}
    expired_token = create_access_token(payload, expires_delta=timedelta(seconds=-10))

    assert decode_access_token(expired_token) is None


# ============================================================================
# 3. SIGNUP ENDPOINT TESTS
# ============================================================================

def test_signup_successful():
    """Verify citizen registration creates a user, hashes password, and returns JWT."""
    signup_payload = {
        "email": "citizen.kavita@jal-dharani.org",
        "password": "Password123!",
        "name": "Kavita Deshmukh",
        "city": "Pune",
        "state": "Maharashtra",
        "role": "citizen",
        "bio": "Neighborhood groundwater volunteer.",
    }

    response = client.post("/api/auth/signup", json=signup_payload)
    assert response.status_code == 201

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] > 0

    user = data["user"]
    assert user["email"] == "citizen.kavita@jal-dharani.org"
    assert user["name"] == "Kavita Deshmukh"
    assert user["role"] == "citizen"
    assert user["city"] == "Pune"

    # Security check: password or hash MUST NOT be in response
    assert "password" not in user
    assert "password_hash" not in user

    # Database check: verify stored in DB with hashed password
    db = TestingSessionLocal()
    db_user = db.query(User).filter(User.email == "citizen.kavita@jal-dharani.org").first()
    assert db_user is not None
    assert db_user.password_hash != "Password123!"
    assert verify_password("Password123!", db_user.password_hash) is True
    db.close()


def test_signup_duplicate_email_rejected():
    """Verify that registering with an existing email returns 400 Bad Request."""
    payload = {
        "email": "duplicate@jal-dharani.org",
        "password": "Password123!",
        "name": "First User",
    }
    first_res = client.post("/api/auth/signup", json=payload)
    assert first_res.status_code == 201

    # Attempt second signup with same email (case-insensitive)
    duplicate_payload = {
        "email": "DUPLICATE@jal-dharani.org",
        "password": "OtherPassword456!",
        "name": "Second User",
    }
    second_res = client.post("/api/auth/signup", json=duplicate_payload)
    assert second_res.status_code == 400
    assert "already exists" in second_res.json()["detail"].lower()


def test_signup_role_privilege_escalation_prevented():
    """Verify that registering with role 'hydrologist' or 'admin' defaults to 'citizen'."""
    payload = {
        "email": "sneaky@jal-dharani.org",
        "password": "Password123!",
        "name": "Sneaky User",
        "role": "hydrologist",  # Unauthorized role escalation attempt
    }
    res = client.post("/api/auth/signup", json=payload)
    assert res.status_code == 201
    assert res.json()["user"]["role"] == "citizen"


# ============================================================================
# 4. LOGIN ENDPOINT TESTS
# ============================================================================

def test_login_successful():
    """Verify login with correct credentials returns valid JWT token."""
    # Pre-register user
    client.post("/api/auth/signup", json={
        "email": "login.test@jal-dharani.org",
        "password": "ValidPassword999!",
        "name": "Login Tester",
    })

    # Attempt login
    login_res = client.post("/api/auth/login", json={
        "email": "login.test@jal-dharani.org",
        "password": "ValidPassword999!",
    })
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login.test@jal-dharani.org"


def test_login_invalid_password():
    """Verify login with incorrect password returns 401 with generic error message."""
    client.post("/api/auth/signup", json={
        "email": "user.wrongpass@jal-dharani.org",
        "password": "CorrectPassword123!",
        "name": "User One",
    })

    res = client.post("/api/auth/login", json={
        "email": "user.wrongpass@jal-dharani.org",
        "password": "WrongPassword!",
    })
    assert res.status_code == 401
    assert "invalid email or password" in res.json()["detail"].lower()


def test_login_nonexistent_email_no_enumeration():
    """Verify login with unregistered email returns same generic 401 message (no user enumeration)."""
    res = client.post("/api/auth/login", json={
        "email": "nonexistent@jal-dharani.org",
        "password": "AnyPassword123!",
    })
    assert res.status_code == 401
    assert "invalid email or password" in res.json()["detail"].lower()


# ============================================================================
# 5. AUTHENTICATED PROFILE & PROTECTED ROUTE TESTS
# ============================================================================

def test_get_me_authenticated():
    """Verify GET /api/auth/me returns authenticated profile when valid Bearer token provided."""
    signup_res = client.post("/api/auth/signup", json={
        "email": "me.test@jal-dharani.org",
        "password": "Password123!",
        "name": "Me Tester",
        "city": "Nashik",
    })
    token = signup_res.json()["access_token"]

    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    user = res.json()
    assert user["email"] == "me.test@jal-dharani.org"
    assert user["city"] == "Nashik"


def test_get_me_unauthorized_cases():
    """Verify GET /api/auth/me rejects missing, malformed, and expired tokens."""
    # 1. Missing token
    res_no_token = client.get("/api/auth/me")
    assert res_no_token.status_code == 401

    # 2. Malformed token
    res_malformed = client.get("/api/auth/me", headers={"Authorization": "Bearer not-a-valid-token"})
    assert res_malformed.status_code == 401

    # 3. Expired token
    expired_token = create_access_token({"sub": "usr-1", "email": "me.test@jal-dharani.org"}, expires_delta=timedelta(seconds=-60))
    res_expired = client.get("/api/auth/me", headers={"Authorization": f"Bearer {expired_token}"})
    assert res_expired.status_code == 401


def test_auth_health_endpoint():
    """Verify GET /api/auth/health returns active config status without revealing secrets."""
    res = client.get("/api/auth/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "algorithm" in data
    assert "token_expiration_minutes" in data
    # Ensure secret is NOT present
    assert "secret" not in str(data).lower()


# ============================================================================
# 6. PROTECTED ENDPOINTS & IMPERSONATION REJECTION TESTS
# ============================================================================

def test_protected_endpoints_reject_anonymous_access():
    """Verify write endpoints strictly require an active authenticated session."""
    # 1. Report creation
    report_res = client.post("/api/reports", json={
        "title": "Unauthorized observation",
        "category": "sewage-inflow",
        "description": "Anon test",
        "location_name": "Lake Site",
        "city": "Pune",
        "state": "Maharashtra",
        "latitude": 18.5,
        "longitude": 73.8,
    })
    assert report_res.status_code == 401
    assert "authentication required" in report_res.json()["detail"].lower()

    # 2. Activity creation
    act_res = client.post("/api/activities", json={
        "title": "Unauthorized cleanup",
        "description": "Anon test",
        "category": "cleanup",
        "latitude": 18.5,
        "longitude": 73.8,
        "date": "2026-11-01",
        "time": "08:00 AM",
    })
    assert act_res.status_code == 401

    # 3. Community creation
    comm_res = client.post("/api/communities", json={
        "name": "Unauthorized community",
        "tagline": "Tagline",
        "description": "Anon test",
        "city": "Pune",
        "state": "Maharashtra",
        "latitude": 18.5,
        "longitude": 73.8,
    })
    assert comm_res.status_code == 401

    # 4. Activity join
    join_res = client.post("/api/activities/act-test-123/join")
    assert join_res.status_code == 401


def test_authenticated_user_identity_derived_from_token_not_payload():
    """
    Verify that acting user's ID is derived strictly from the verified JWT token,
    preventing any spoofing or impersonation of other users in mutation operations.
    """
    from app.dependencies.auth import get_current_user

    # Create real authenticated user in test DB
    signup_res = client.post("/api/auth/signup", json={
        "email": "genuine.user@jal-dharani.org",
        "password": "Password123!",
        "name": "Genuine User",
    })
    token = signup_res.json()["access_token"]
    user_id = signup_res.json()["user"]["id"]

    # Call get_current_user dependency directly with the token to verify extraction
    from fastapi.security import HTTPAuthorizationCredentials
    auth_cred = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    db = TestingSessionLocal()
    acting_user = get_current_user(auth_credentials=auth_cred, authorization=None, db=db)
    assert acting_user.id == user_id
    assert acting_user.email == "genuine.user@jal-dharani.org"
    db.close()

