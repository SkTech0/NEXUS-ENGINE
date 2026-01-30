"""
Engine Intelligence — Decision traceability and reasoning logs (ERL-4).
Decision traceability, reasoning logs, explainability hooks.
"""
from __future__ import annotations

import functools
import time
from dataclasses import dataclass, field
from typing import Any, Callable, TypeVar

T = TypeVar("T")


@dataclass
class DecisionTrace:
    """Trace for a single decision: option_id, score, reason, latency_ms."""

    option_id: str
    score: float
    reason: str = ""
    latency_ms: float = 0.0
    trace_id: str = ""
    inputs_summary: dict[str, Any] = field(default_factory=dict)


@dataclass
class ReasoningLog:
    """Log entry for reasoning step: rule/fact, outcome, confidence."""

    step: str
    outcome: str
    confidence: float = 1.0
    facts_used: list[str] = field(default_factory=list)


def decision_traced(
    trace_id: str = "",
    logger: Any = None,
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """Decorator: wrap decision call with trace (latency, result summary)."""

    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            start = time.perf_counter()
            out = fn(*args, **kwargs)
            latency_ms = (time.perf_counter() - start) * 1000
            if logger and hasattr(logger, "info") and out is not None:
                summary = {"latency_ms": latency_ms}
                if hasattr(out, "option_id"):
                    summary["option_id"] = getattr(out, "option_id", "")
                    summary["score"] = getattr(out, "score", 0)
                logger.info("decision", {"trace_id": trace_id, **summary})
            return out

        return wrapper  # type: ignore[return-value]

    return decorator


def validate_confidence(confidence: float, min_confidence: float = 0.0, max_confidence: float = 1.0) -> bool:
    """Validate confidence in [min_confidence, max_confidence]. ERL-4 confidence validation."""
    return min_confidence <= confidence <= max_confidence
