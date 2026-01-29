"""
Learning engine — update model from examples (abstract interface).
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class Example:
    """A single example: inputs and target."""

    inputs: dict[str, Any]
    target: Any


@dataclass
class LearningState:
    """Mutable learning state: epoch and metrics."""

    epoch: int = 0
    metrics: dict[str, float] = field(default_factory=dict)


class LearningEngine:
    """
    Learning: fit(examples) updates internal state; predict(inputs) returns output.
    Default: no-op fit, predict returns None. Override or inject strategy. Testable.
    """

    def __init__(
        self,
        fit_fn: Callable[[list[Example], LearningState], None] | None = None,
        predict_fn: Callable[[dict[str, Any]], Any] | None = None,
    ) -> None:
        self._fit_fn = fit_fn or (lambda ex, s: None)
        self._predict_fn = predict_fn or (lambda x: None)
        self._state = LearningState()

    def fit(self, examples: list[Example]) -> LearningState:
        """Update model from examples. Returns current state. Testable."""
        self._fit_fn(examples, self._state)
        return self._state

    def predict(self, inputs: dict[str, Any]) -> Any:
        """Predict for given inputs. Testable."""
        return self._predict_fn(inputs)

    def get_state(self) -> LearningState:
        """Current learning state. Testable."""
        return self._state

    def update_metrics(self, key: str, value: float) -> None:
        """Set a metric. Testable."""
        self._state.metrics[key] = value


def create_learning_engine(
    fit_fn: Callable[[list[Example], LearningState], None] | None = None,
    predict_fn: Callable[[dict[str, Any]], Any] | None = None,
) -> LearningEngine:
    """Create learning engine. Testable."""
    return LearningEngine(fit_fn=fit_fn, predict_fn=predict_fn)
