"""
Adapter layer for engine-trust-service.

Trust confidence is computed from platform signals via TrustConfidenceEngine.
Verify remains stubbed and logically separate from confidence. See TRUST_CONFIDENCE.md.
"""
from typing import Any

from .confidence_engine import create_confidence_engine
from .signal_collector import collect


def verify(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Verify claims/tokens. Stubbed for future extension.

    Logically separate from confidence computation. Will be wired to
    verification logic (identity, compliance) in a later phase.
    """
    _ = payload  # unused until verification is implemented
    return {"valid": True, "message": "verified"}


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
