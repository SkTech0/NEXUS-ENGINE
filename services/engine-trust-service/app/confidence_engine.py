"""
Trust confidence engine — deterministic confidence from signals.

Computes platform trust confidence (0.0–1.0) from TrustSignal. Weights are
tuned for platform control-plane use: self-health and dependency readiness
dominate; engine health and latency signals adjust the score.

Formula (deterministic):
  confidence = (
    W_SELF * self_healthy +
    W_DEPS * dependency_readiness +
    W_ENGINES * engine_health_ratio +
    W_TIMEOUT * (0.0 if latency_timeout_observed else 1.0)
  ) / weight_sum

Weights are configurable for future tuning without logic changes.
"""
from dataclasses import dataclass
from typing import Any

from .signals import TrustSignal

# Weights: self > deps > engines > timeout penalty
W_SELF = 0.35
W_DEPS = 0.35
W_ENGINES = 0.25
W_TIMEOUT = 0.05
WEIGHT_SUM = W_SELF + W_DEPS + W_ENGINES + W_TIMEOUT


@dataclass
class ConfidenceResult:
    """Result of confidence computation with explanation."""

    confidence: float
    factors: dict[str, Any]


class TrustConfidenceEngine:
    """
    Deterministic confidence computation from TrustSignal.

    Stateless, side-effect free. Safe for concurrent use.
    """

    def compute(self, signals: TrustSignal) -> ConfidenceResult:
        """
        Compute confidence (0.0–1.0) from signals.

        Returns confidence and a factors dict for explainability.
        """
        self_val = 1.0 if signals.self_healthy else 0.0
        deps_val = 1.0 if signals.dependency_readiness else 0.0
        engines_val = signals.engine_health_ratio()
        timeout_val = 0.0 if signals.latency_timeout_observed else 1.0

        raw = (
            W_SELF * self_val
            + W_DEPS * deps_val
            + W_ENGINES * engines_val
            + W_TIMEOUT * timeout_val
        ) / WEIGHT_SUM
        confidence = max(0.0, min(1.0, round(raw, 4)))

        factors = {
            "self_healthy": signals.self_healthy,
            "dependency_readiness": signals.dependency_readiness,
            "engine_health_ratio": engines_val,
            "latency_timeout_observed": signals.latency_timeout_observed,
            "weights": {"self": W_SELF, "deps": W_DEPS, "engines": W_ENGINES, "timeout": W_TIMEOUT},
        }
        if signals.engine_health:
            factors["engine_health"] = dict(signals.engine_health)

        return ConfidenceResult(confidence=confidence, factors=factors)


def create_confidence_engine() -> TrustConfidenceEngine:
    """Factory for TrustConfidenceEngine."""
    return TrustConfidenceEngine()
