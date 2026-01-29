"""
Decision engine — choose among options given context and criteria.
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable


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
    Testable.
    """

    def __init__(
        self,
        scorer: Callable[[Option, DecisionContext], float] | None = None,
    ) -> None:
        self._scorer = scorer or (lambda o, c: 0.0)
        self._options: list[Option] = []

    def add_option(self, option: Option) -> None:
        """Add option. Testable."""
        self._options.append(option)

    def set_options(self, options: list[Option]) -> None:
        """Set options (replace). Testable."""
        self._options = list(options)

    def decide(self, context: DecisionContext) -> DecisionResult | None:
        """
        Score all options; return best (highest score). Tie: first.
        Testable.
        """
        if not self._options:
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
        return DecisionResult(
            option_id=best.id,
            score=best_score,
            reason=f"score={best_score}",
        )

    def rank(self, context: DecisionContext) -> list[tuple[Option, float]]:
        """Return options sorted by score (desc). Testable."""
        scored = [(o, self._scorer(o, context)) for o in self._options]
        scored.sort(key=lambda x: -x[1])
        return scored


def create_decision_engine(
    scorer: Callable[[Option, DecisionContext], float] | None = None,
) -> DecisionEngine:
    """Create decision engine. Testable."""
    return DecisionEngine(scorer=scorer)
