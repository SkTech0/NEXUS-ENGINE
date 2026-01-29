"""
Evaluator — score outputs against expected (metrics).
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class EvalSample:
    """A single sample: predicted and expected."""

    predicted: Any
    expected: Any


@dataclass
class EvalResult:
    """Aggregate result: metrics dict."""

    metrics: dict[str, float] = field(default_factory=dict)

    def get(self, name: str) -> float | None:
        """Get metric by name. Testable."""
        return self.metrics.get(name)


class Evaluator:
    """
    Evaluation: add metric functions; evaluate(samples) returns EvalResult.
    Testable.
    """

    def __init__(self) -> None:
        self._metrics: list[tuple[str, Callable[[list[EvalSample]], float]]] = []

    def add_metric(self, name: str, fn: Callable[[list[EvalSample]], float]) -> None:
        """Add metric. Testable."""
        self._metrics.append((name, fn))

    def evaluate(self, samples: list[EvalSample]) -> EvalResult:
        """Compute all metrics over samples. Testable."""
        result = EvalResult()
        for name, fn in self._metrics:
            result.metrics[name] = fn(samples)
        return result


def accuracy(samples: list[EvalSample]) -> float:
    """Accuracy: fraction where predicted == expected. Testable."""
    if not samples:
        return 0.0
    correct = sum(1 for s in samples if s.predicted == s.expected)
    return correct / len(samples)


def create_evaluator() -> Evaluator:
    """Create empty evaluator. Testable."""
    return Evaluator()
