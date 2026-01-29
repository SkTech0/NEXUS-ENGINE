"""
Trust score — compute and aggregate trust scores.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class TrustScore:
    """A trust score: value [0, 1], source, factors."""

    value: float
    source: str = ""
    factors: dict[str, float] = field(default_factory=dict)

    def clamp(self) -> "TrustScore":
        """Clamp value to [0, 1]. Testable."""
        v = max(0.0, min(1.0, self.value))
        return TrustScore(value=v, source=self.source, factors=dict(self.factors))


class TrustScoreEngine:
    """
    Trust score: set aggregator; compute(entity_id, inputs) returns TrustScore.
    Testable.
    """

    def __init__(self) -> None:
        self._scores: dict[str, TrustScore] = {}
        self._aggregator: Callable[[list[TrustScore]], float] | None = None

    def set_aggregator(self, fn: Callable[[list[TrustScore]], float]) -> None:
        """Set (list of scores) -> aggregate. Testable."""
        self._aggregator = fn

    def add_score(self, entity_id: str, score: TrustScore) -> None:
        """Add score for entity (append to list internally). Testable."""
        if entity_id not in self._scores:
            self._scores[entity_id] = score.clamp()
        else:
            # Store single; for multiple use list and aggregate on get
            self._scores[entity_id] = score.clamp()

    def set_score(self, entity_id: str, score: TrustScore) -> None:
        """Set single score for entity. Testable."""
        self._scores[entity_id] = score.clamp()

    def get(self, entity_id: str) -> TrustScore | None:
        """Get score for entity. Testable."""
        return self._scores.get(entity_id)

    def compute(self, entity_id: str, inputs: dict[str, Any]) -> TrustScore:
        """
        Compute score from inputs; if no custom logic, return stored or default.
        Testable.
        """
        existing = self._scores.get(entity_id)
        if existing is not None:
            return existing
        return TrustScore(value=0.0, source="default", factors=dict(inputs))


def create_trust_score_engine() -> TrustScoreEngine:
    """Create trust score engine. Testable."""
    return TrustScoreEngine()
