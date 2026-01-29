"""
Inference engine — derive conclusions from premises.
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable


@dataclass
class Premise:
    """A premise: label and value."""

    label: str
    value: Any


@dataclass
class Conclusion:
    """A conclusion: outcome and confidence [0, 1]."""

    outcome: Any
    confidence: float


class InferenceEngine:
    """
    Inference: register handlers per premise set; infer(premises) returns conclusions.
    Testable.
    """

    def __init__(self) -> None:
        self._handlers: list[Callable[[list[Premise]], Conclusion | None]] = []

    def add_handler(self, handler: Callable[[list[Premise]], Conclusion | None]) -> None:
        """Add inference handler. Testable."""
        self._handlers.append(handler)

    def infer(self, premises: list[Premise]) -> list[Conclusion]:
        """
        Run all handlers on premises; collect non-None conclusions.
        Testable.
        """
        results: list[Conclusion] = []
        for h in self._handlers:
            c = h(premises)
            if c is not None:
                results.append(c)
        return results

    def infer_best(self, premises: list[Premise]) -> Conclusion | None:
        """Return single conclusion with highest confidence. Testable."""
        conclusions = self.infer(premises)
        if not conclusions:
            return None
        return max(conclusions, key=lambda c: c.confidence)


def create_inference_engine() -> InferenceEngine:
    """Create empty inference engine. Testable."""
    return InferenceEngine()
