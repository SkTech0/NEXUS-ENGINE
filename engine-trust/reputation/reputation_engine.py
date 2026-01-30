"""
Reputation engine — track and compute reputation scores.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-trust")


@dataclass
class ReputationEntry:
    """A reputation entry: entity_id, score, factors."""

    entity_id: str
    score: float = 0.0
    factors: dict[str, float] = field(default_factory=dict)


class ReputationEngine:
    """
    Reputation: set score, get, update; optional decay.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._scores: dict[str, ReputationEntry] = {}

    def set_score(self, entity_id: str, score: float, factors: dict[str, float] | None = None) -> None:
        """Set reputation score. Validates entity_id before state mutation."""
        if not (entity_id or "").strip():
            raise ValidationError("entity_id is required", details={"field": "entity_id"})
        if factors is None:
            factors = {}
        self._scores[entity_id] = ReputationEntry(
            entity_id=entity_id,
            score=score,
            factors=factors,
        )
        _logger.info("reputation_engine.set_score entity_id=%s score=%s", entity_id, score)

    def get(self, entity_id: str) -> ReputationEntry | None:
        """Get reputation entry. Validates entity_id."""
        if not (entity_id or "").strip():
            raise ValidationError("entity_id is required", details={"field": "entity_id"})
        return self._scores.get(entity_id)

    def get_score(self, entity_id: str) -> float:
        """Get score only; 0.0 if missing. Validates entity_id."""
        if not (entity_id or "").strip():
            raise ValidationError("entity_id is required", details={"field": "entity_id"})
        entry = self._scores.get(entity_id)
        return entry.score if entry is not None else 0.0

    def update(self, entity_id: str, delta: float, factor: str = "default") -> None:
        """Update score by delta; record factor. Validates entity_id before state mutation."""
        if not (entity_id or "").strip():
            raise ValidationError("entity_id is required", details={"field": "entity_id"})
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
