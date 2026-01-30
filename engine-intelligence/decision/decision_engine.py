"""
Decision engine — choose among options given context and criteria.
Enterprise: validation, logging, clear errors (ERL-4).
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Callable

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-intelligence")


@dataclass
class Option:
    """A decision option: id and payload."""

    id: str
    payload: Any = None


@dataclass
class DecisionContext:
    """Context for a decision: inputs and metadata."""

    inputs: dict[str, Any]
    metadata: dict[str, Any] | None = None


@dataclass
class DecisionResult:
    """Result: chosen option and score/reason."""

    option_id: str
    score: float
    reason: str = ""


class DecisionEngine:
    """
    Decision: score function per option; decide(context) returns best option.
    Enterprise: input validation, structured logging, safe errors.
    """

    def __init__(
        self,
        scorer: Callable[[Option, DecisionContext], float] | None = None,
    ) -> None:
        self._scorer = scorer or (lambda o, c: 0.0)
        self._options: list[Option] = []

    def add_option(self, option: Option) -> None:
        """Add option. Validates option id."""
        if not (option.id or "").strip():
            raise ValidationError("option id is required", details={"field": "id"})
        self._options.append(option)

    def set_options(self, options: list[Option]) -> None:
        """Set options (replace). Validates each option id."""
        for i, opt in enumerate(options):
            if not (opt.id or "").strip():
                raise ValidationError("option id is required", details={"index": i, "field": "id"})
        self._options = list(options)

    def decide(self, context: DecisionContext) -> DecisionResult | None:
        """
        Score all options; return best (highest score). Tie: first.
        Validates context; logs decision.
        """
        if context is None:
            raise ValidationError("context is required", details={"field": "context"})
        if not isinstance(getattr(context, "inputs", None), dict):
            raise ValidationError("context.inputs must be a dict", details={"field": "inputs"})
        if not self._options:
            _logger.debug("decision_engine.decide no options")
            return None
        best: Option | None = None
        best_score = float("-inf")
        for opt in self._options:
            s = self._scorer(opt, context)
            if s > best_score:
                best_score = s
                best = opt
        if best is None:
            return None
        result = DecisionResult(
            option_id=best.id,
            score=best_score,
            reason=f"score={best_score}",
        )
        _logger.info("decision_engine.decide option_id=%s score=%s", result.option_id, result.score)
        return result

    def rank(self, context: DecisionContext) -> list[tuple[Option, float]]:
        """Return options sorted by score (desc). Validates context at entry."""
        if context is None:
            raise ValidationError("context is required", details={"field": "context"})
        if not isinstance(getattr(context, "inputs", None), dict):
            raise ValidationError("context.inputs must be a dict", details={"field": "inputs"})
        scored = [(o, self._scorer(o, context)) for o in self._options]
        scored.sort(key=lambda x: -x[1])
        return scored


def create_decision_engine(
    scorer: Callable[[Option, DecisionContext], float] | None = None,
) -> DecisionEngine:
    """Create decision engine. Testable."""
    return DecisionEngine(scorer=scorer)
