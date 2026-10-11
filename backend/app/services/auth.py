import os
import json
import base64
import hashlib
import hmac
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
from app.models.user import User
from app.schemas.user import UserResponse, UserLocation, UserImpactMetrics

# Configuration loaded from environment variables
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jal-dharani-secure-dev-jwt-secret-key-2026-chennai-pune")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours default


# Try importing bcrypt, fallback to standard library PBKDF2-HMAC-SHA256
_HAS_BCRYPT = False
try:
    import bcrypt  # type: ignore
    _HAS_BCRYPT = True
except ImportError:
    pass

# Try importing pyjwt, fallback to standard RFC 7519 HS256 JWT
_HAS_PYJWT = False
try:
    import jwt  # type: ignore
    _HAS_PYJWT = True
except ImportError:
    pass


def hash_password(password: str) -> str:
    """
    Hashes a plaintext password using bcrypt if available,
    or PBKDF2-HMAC-SHA256 (310,000 rounds per OWASP guidelines).
    """
    if _HAS_BCRYPT:
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    
    salt = secrets.token_hex(16)
    iterations = 310000
    hash_bytes = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), iterations)
    hash_hex = hash_bytes.hex()
    return f"pbkdf2_sha256${iterations}${salt}${hash_hex}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against its stored hash.
    Safely supports bcrypt and PBKDF2 formats with constant-time comparison.
    """
    if not hashed_password or not plain_password:
        return False

    # Check for bcrypt prefix ($2b$, $2a$, $2y$)
    if hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        if _HAS_BCRYPT:
            try:
                return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
            except Exception:
                return False
        return False

    # Check for PBKDF2-HMAC-SHA256 format: pbkdf2_sha256$iterations$salt$hash
    if hashed_password.startswith("pbkdf2_sha256$"):
        parts = hashed_password.split("$")
        if len(parts) != 4:
            return False
        try:
            iterations = int(parts[1])
            salt = parts[2]
            expected_hash = parts[3]
            calculated_hash = hashlib.pbkdf2_hmac(
                "sha256",
                plain_password.encode("utf-8"),
                salt.encode("utf-8"),
                iterations,
            ).hex()
            return hmac.compare_digest(calculated_hash, expected_hash)
        except Exception:
            return False

    # Fallback to direct comparison only if unexpected format
    return False


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * ((4 - len(data) % 4) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Encodes a signed JSON Web Token (HS256) with expiration.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
    })

    if _HAS_PYJWT:
        return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

    # Standard RFC 7519 implementation
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _b64url_encode(json.dumps(to_encode, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    sig_b64 = _b64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{sig_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a JSON Web Token (HS256), checking signature and expiry.
    Returns the payload dictionary or None if invalid/expired.
    """
    if not token or not isinstance(token, str):
        return None

    if _HAS_PYJWT:
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return payload
        except Exception:
            return None

    # Standard RFC 7519 decoder
    parts = token.split(".")
    if len(parts) != 3:
        return None

    header_b64, payload_b64, sig_b64 = parts
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    expected_sig = hmac.new(JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    try:
        actual_sig = _b64url_decode(sig_b64)
    except Exception:
        return None

    if not hmac.compare_digest(expected_sig, actual_sig):
        return None

    try:
        payload_bytes = _b64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode("utf-8"))
    except Exception:
        return None

    # Check expiration
    exp = payload.get("exp")
    if exp is not None:
        now_ts = int(datetime.now(timezone.utc).timestamp())
        if now_ts > exp:
            return None

    return payload


def build_user_response(user: User) -> UserResponse:
    """
    Builds a consistent UserResponse conforming to frontend User types.
    """
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        avatar=user.avatar,
        role=user.role,
        city=user.city,
        state=user.state,
        neighborhood=user.neighborhood,
        bio=user.bio or "",
        created_at=user.created_at,
        location=UserLocation(
            city=user.city,
            state=user.state,
            neighborhood=user.neighborhood,
        ),
        impactMetrics=UserImpactMetrics(
            volunteerHours=12 if user.role == "volunteer" else 24 if user.role == "community_lead" else 4,
            activitiesJoined=3 if user.role != "citizen" else 1,
            activitiesOrganized=2 if user.role == "community_lead" else 0,
            reportsSubmitted=1,
            reportsVerified=1,
            waterBodiesMonitored=2,
        ),
    )
