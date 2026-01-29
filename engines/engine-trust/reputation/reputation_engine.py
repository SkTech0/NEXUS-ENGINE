"""
Reputation engine — track and compute reputation scores.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ReputationEntry:
    """A reputation entry: entity_id, score, factors."""

    entity_id: str
    score: float = 0.0
    factors: dict[str, float] = field(default_factory=dict)


class ReputationEngine:
    """
    Reputation: set score, get, update; optional decay.
    Testable.
    """

    def __init__(self) -> None:
        self._scores: dict[str, ReputationEntry] = {}

    def set_score(self, entity_id: str, score: float, factors: dict[str, float] | None = None) -> None:
        """Set reputation score. Testable."""
        self._scores[entity_id] = ReputationEntry(
            entity_id=entity_id,
            score=score,
            factors=factors or {},
        )

    def get(self, entity_id: str) -> ReputationEntry | None:
        """Get reputation entry. Testable."""
        return self._scores.get(entity_id)

    def get_score(self, entity_id: str) -> float:
        """Get score only; 0.0 if missing. Testable."""
        entry = self._scores.get(entity_id)
        return entry.score if entry is not None else 0.0

    def update(self, entity_id: str, delta: float, factor: str = "default") -> None:
        """Update score by delta; record factor. Testable."""
        entry = self._scores.get(entity_id)
        if entry is None:
            entry = ReputationEntry(entity_id=entity_id)
            self._scores[entity_id] = entry
        entry.score += delta
        entry.factors[factor] = entry.factors.get(factor, 0.0) + delta

    def list_entities(self) -> list[str]:
        """All entity ids. Testable."""
        return list(self._scores.keys())


def create_reputation_engine() -> ReputationEngine:
    """Create reputation engine. Testable."""
    return ReputationEngine()
