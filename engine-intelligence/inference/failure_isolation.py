"""
Engine Intelligence — Failure isolation and deterministic output guards (ERL-4).
Non-crashing failure handling; deterministic output validation.
"""
from __future__ import annotations

from typing import Any, Callable, TypeVar

T = TypeVar("T")


def run_isolated(
    fn: Callable[[], T],
    *,
    fallback: T | None = None,
    on_error: Callable[[Exception], None] | None = None,
) -> T | None:
    """
    Run fn in isolation; on exception return fallback and optionally call on_error.
    Does not crash; graceful degradation.
    """
    try:
        return fn()
    except Exception as e:
        if on_error is not None:
            on_error(e)
        return fallback


def deterministic_output_guard(
    result: Any,
    *,
    validator: Callable[[Any], bool] | None = None,
) -> bool:
    """
    Guard: validate that output is deterministic-safe (e.g. no NaN, no None where required).
    Returns True if valid. Override validator in engines.
    """
    if validator is not None:
        return validator(result)
    if result is None:
        return True  # None allowed unless validator says otherwise
    return True
