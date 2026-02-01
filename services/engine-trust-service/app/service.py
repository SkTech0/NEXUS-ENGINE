"""
Adapter layer for engine-trust-service.

Trust confidence is computed from platform signals via TrustConfidenceEngine.
Verify implements JWT verification; supports claim-type and payload extraction.
"""
from typing import Any

from .confidence_engine import create_confidence_engine
from .signal_collector import collect


def _extract_token(payload: dict[str, Any]) -> str | None:
    """Extract JWT token from payload. Supports token, jwt, accessToken, payload (string or object)."""
    for key in ("token", "jwt", "accessToken", "access_token"):
        v = payload.get(key)
        if isinstance(v, str) and v.strip():
            return v.strip()
    # Nested: payload.token, payload.jwt, or payload as token string
    inner = payload.get("payload")
    if isinstance(inner, str) and inner.strip():
        return inner.strip()
    if isinstance(inner, dict):
        for key in ("token", "jwt", "accessToken"):
            v = inner.get(key)
            if isinstance(v, str) and v.strip():
                return v.strip()
    return None


def verify(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Verify claims/tokens. Supports JWT verification.

    Payload: { token?: string, jwt?: string, claimType?: string, payload?: { token? } }
    Returns: { valid: bool, message: string, claims?: object }
    """
    if not payload or not isinstance(payload, dict):
        return {"valid": False, "message": "Payload is required"}
    token = _extract_token(payload)
    if not token:
        return {"valid": False, "message": "No token provided (expect token, jwt, or accessToken)"}
    try:
        from .verification.jwt_verifier import verify_jwt
        valid, message, claims = verify_jwt(token)
        out: dict[str, Any] = {"valid": valid, "message": message}
        if claims:
            out["claims"] = claims
        return out
    except ImportError:
        return {"valid": False, "message": "JWT verification not available (install PyJWT)"}


def get_confidence() -> tuple[float, dict[str, Any]]:
    """
    Compute trust confidence from platform signals.

    Returns (confidence, factors) for explainability.
    """
    signals = collect()
    engine = create_confidence_engine()
    result = engine.compute(signals)
    return result.confidence, result.factors


def get_score(entity_id: str) -> dict[str, Any]:
    """
    Get trust score for entity.

    Base score = computed confidence. Entity context may adjust slightly
    (e.g. entity-specific factors); for now uses base confidence as safe default.
    """
    confidence, factors = get_confidence()
    return {
        "entityId": entity_id,
        "score": confidence,
        "source": "trust-confidence-engine",
        "factors": factors,
    }
