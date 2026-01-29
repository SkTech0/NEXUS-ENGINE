"""
Predictor — predict values from inputs (abstract interface).
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable


@dataclass
class Prediction:
    """A prediction: value and optional confidence."""

    value: Any
    confidence: float = 1.0


class Predictor:
    """
    Predictor: set model fn or use default (constant). predict(inputs) returns Prediction.
    Testable.
    """

    def __init__(
        self,
        model_fn: Callable[[dict[str, Any]], Prediction] | None = None,
    ) -> None:
        self._model_fn = model_fn or (lambda x: Prediction(value=None, confidence=0.0))

    def predict(self, inputs: dict[str, Any]) -> Prediction:
        """Predict from inputs. Testable."""
        return self._model_fn(inputs)

    def update(self, inputs: dict[str, Any], target: Any) -> None:
        """
        Optional: update model from (inputs, target). No-op by default.
        Override for online learning. Testable.
        """
        pass


def create_predictor(
    model_fn: Callable[[dict[str, Any]], Prediction] | None = None,
) -> Predictor:
    """Create predictor. Testable."""
    return Predictor(model_fn=model_fn)
