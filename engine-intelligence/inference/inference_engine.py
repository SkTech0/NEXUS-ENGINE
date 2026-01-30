"""
Inference engine — derive conclusions from premises.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Callable

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-intelligence")


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
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(self) -> None:
        self._handlers: list[Callable[[list[Premise]], Conclusion | None]] = []

    def add_handler(self, handler: Callable[[list[Premise]], Conclusion | None]) -> None:
        """Add inference handler. Validates handler non-null."""
        if handler is None:
            raise ValidationError("handler is required", details={"field": "handler"})
        self._handlers.append(handler)

    def infer(self, premises: list[Premise]) -> list[Conclusion]:
        """
        Run all handlers on premises; collect non-None conclusions.
        Validates premises non-null before execution.
        """
        if premises is None:
            raise ValidationError("premises is required", details={"field": "premises"})
        results: list[Conclusion] = []
        for h in self._handlers:
            c = h(premises)
            if c is not None:
                results.append(c)
        _logger.debug("inference_engine.infer premises=%s conclusions=%s", len(premises), len(results))
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
