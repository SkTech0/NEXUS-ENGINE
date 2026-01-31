"""Health endpoint for engine-trust-service."""
from typing import Any

from . import service as svc


def get_health() -> dict[str, Any]:
    """
    Health with computed trust confidence.

    Confidence is derived from platform signals (self-health, dependency
    readiness, engine health probes). LoanDecisionService and readiness
    checks consume this.
    """
    confidence, factors = svc.get_confidence()
    return {
        "status": "healthy",
        "service": "engine-trust-service",
        "confidence": confidence,
        "factors": factors,
    }
