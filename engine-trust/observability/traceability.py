"""
Engine Trust — Audit traceability (ERL-4).
Audit integrity protection, traceability hooks.
"""
from __future__ import annotations

import functools
import time
from typing import Any, Callable, TypeVar

T = TypeVar("T")


def audit_traced(
    operation: str = "audit",
    trace_id: str = "",
    logger: Any = None,
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """Decorator: wrap trust/audit call with trace (latency, operation)."""

    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            start = time.perf_counter()
            out = fn(*args, **kwargs)
            latency_ms = (time.perf_counter() - start) * 1000
            if logger and hasattr(logger, "info"):
                logger.info(operation, {"trace_id": trace_id, "latency_ms": latency_ms, "status": "ok"})
            return out

        return wrapper  # type: ignore[return-value]

    return decorator
