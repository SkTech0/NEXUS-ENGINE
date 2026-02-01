"""
JWT verification for trust engine.

Enterprise-grade token verification: signature validation, expiry, issuer, audience.
Supports HS256, RS256. Configurable via env: TRUST_JWT_SECRET, TRUST_JWT_ALGORITHMS, TRUST_JWT_ISSUER, TRUST_JWT_AUDIENCE.
"""
from __future__ import annotations

import logging
import os
from typing import Any

_logger = logging.getLogger("engine-trust-service.verification")

# Optional: strict mode rejects tokens without configured secret (production)
_STRICT_MODE = os.environ.get("TRUST_JWT_STRICT", "false").lower() in ("true", "1", "yes")
_SECRET = os.environ.get("TRUST_JWT_SECRET", "").strip()
_ALGORITHMS = [
    a.strip()
    for a in os.environ.get("TRUST_JWT_ALGORITHMS", "HS256,RS256").split(",")
    if a.strip()
]
_ISSUER = os.environ.get("TRUST_JWT_ISSUER", "").strip() or None
_AUDIENCE = os.environ.get("TRUST_JWT_AUDIENCE", "").strip() or None


def verify_jwt(token: str) -> tuple[bool, str | None, dict[str, Any] | None]:
    """
    Verify JWT token. Returns (valid, message, claims).
    If valid, claims contains decoded payload (sub, exp, iat, etc.).
    """
    if not token or not isinstance(token, str):
        return False, "Token is required", None
    token = token.strip()
    if not token:
        return False, "Token is empty", None
    try:
        import jwt
    except ImportError:
        _logger.warning("PyJWT not installed; JWT verification unavailable")
        return False, "JWT verification not available (install PyJWT)", None

    try:
        options: dict[str, bool] = {"verify_signature": True, "verify_exp": True}
        kwargs: dict[str, Any] = {"algorithms": _ALGORITHMS, "options": options}
        if _SECRET:
            kwargs["key"] = _SECRET
        else:
            if _STRICT_MODE:
                return False, "JWT secret not configured (TRUST_JWT_SECRET)", None
            options["verify_signature"] = False  # Allow unverified for dev; log warning
            kwargs["key"] = ""  # Required by PyJWT but unused when verify_signature=False
            _logger.debug("TRUST_JWT_SECRET not set; skipping signature verification")
        if _ISSUER:
            kwargs["issuer"] = _ISSUER
            options["verify_iss"] = True
        if _AUDIENCE:
            kwargs["audience"] = _AUDIENCE
            options["verify_aud"] = True
        payload = jwt.decode(token, **kwargs)
        return True, "valid", dict(payload)
    except jwt.ExpiredSignatureError:
        return False, "Token expired", None
    except jwt.InvalidAudienceError:
        return False, "Invalid audience", None
    except jwt.InvalidIssuerError:
        return False, "Invalid issuer", None
    except jwt.InvalidSignatureError:
        return False, "Invalid signature", None
    except jwt.DecodeError as e:
        return False, f"Invalid token: {e}", None
    except Exception as e:
        _logger.warning("JWT verification error: %s", e)
        return False, str(e), None


def generate_demo_jwt() -> str | None:
    """
    Generate a demo JWT signed with TRUST_JWT_SECRET. Returns None if secret not configured.
    Used by product-ui Verify Token so generated tokens validate in prod.
    """
    if not _SECRET:
        return None
    try:
        import jwt
    except ImportError:
        return None
    import time
    now = int(time.time())
    payload = {
        "sub": "demo-user",
        "aud": "nexus-engine",
        "iat": now,
        "exp": now + 3600,
        "demo": True,
    }
    return jwt.encode(
        payload,
        _SECRET,
        algorithm="HS256",
    )
