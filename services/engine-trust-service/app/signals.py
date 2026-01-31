"""
Trust signal model — inputs for confidence computation.

Trust confidence is computed from platform signals. This module defines the
TrustSignal structure. Signals are collected at request time and passed to
TrustConfidenceEngine for deterministic scoring.

Signals:
- self_healthy: This service is running and responsive.
- dependency_readiness: Dependent services (if probed) are reachable.
- engine_health: Per-engine health status from optional probes.
- latency_timeout_observed: True if any probe timed out (degradation).
"""
from dataclasses import dataclass, field


@dataclass(frozen=True)
class TrustSignal:
    """
    Immutable snapshot of platform trust signals.

    Used as input to TrustConfidenceEngine.compute(). All fields should be
    populated by SignalCollector. Empty engine_health means no probes
    configured; treated as neutral (no degradation).
    """

    self_healthy: bool = True
    dependency_readiness: bool = True
    engine_health: dict[str, bool] = field(default_factory=dict)
    latency_timeout_observed: bool = False

    def engine_health_ratio(self) -> float:
        """Ratio of healthy engines (0.0–1.0). Empty map → 1.0 (no data)."""
        if not self.engine_health:
            return 1.0
        healthy = sum(1 for v in self.engine_health.values() if v)
        return healthy / len(self.engine_health) if self.engine_health else 1.0
