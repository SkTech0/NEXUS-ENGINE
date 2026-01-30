"""
Engine Trust — Resilience policy (ERL-4).
Retries, timeouts, safe failure.
"""
from __future__ import annotations

import functools
import time
from dataclasses import dataclass
from typing import Any, Callable, TypeVar

T = TypeVar("T")


@dataclass
class RetryPolicy:
    max_attempts: int = 3
    initial_delay_ms: float = 100.0
    max_delay_ms: float = 10_000.0
    backoff_multiplier: float = 2.0
    retryable_errors: tuple[str, ...] = ("DependencyError", "TimeoutError", "ExecutionError")


@dataclass
class TimeoutPolicy:
    timeout_ms: float
    operation: str = ""


def with_retry(
    policy: RetryPolicy | None = None,
    is_retryable: Callable[[Exception], bool] | None = None,
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    pol = policy or RetryPolicy()

    def _retryable(e: Exception) -> bool:
        if is_retryable:
            return is_retryable(e)
        return type(e).__name__ in pol.retryable_errors

    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            last: Exception | None = None
            delay = pol.initial_delay_ms / 1000.0
            for attempt in range(pol.max_attempts):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    last = e
                    if not _retryable(e) or attempt == pol.max_attempts - 1:
                        raise
                    time.sleep(min(delay, pol.max_delay_ms / 1000.0))
                    delay = min(delay * pol.backoff_multiplier, pol.max_delay_ms / 1000.0)
            raise last  # type: ignore[misc]

        return wrapper  # type: ignore[return-value]

    return decorator


def with_timeout(timeout_ms: float, operation: str = "") -> Callable[[Callable[..., T]], Callable[..., T]]:
    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            return fn(*args, **kwargs)

        return wrapper  # type: ignore[return-value]

    return decorator


class ResiliencePolicy:
    def __init__(
        self,
        default_retry: RetryPolicy | None = None,
        default_timeout_ms: float | None = None,
    ) -> None:
        self.default_retry = default_retry or RetryPolicy()
        self.default_timeout_ms = default_timeout_ms
        self._retry_by_op: dict[str, RetryPolicy] = {}
        self._timeout_by_op: dict[str, TimeoutPolicy] = {}

    def get_retry_policy(self, operation: str) -> RetryPolicy:
        return self._retry_by_op.get(operation, self.default_retry)

    def get_timeout_policy(self, operation: str) -> TimeoutPolicy | None:
        if operation in self._timeout_by_op:
            return self._timeout_by_op[operation]
        if self.default_timeout_ms is not None:
            return TimeoutPolicy(timeout_ms=self.default_timeout_ms, operation=operation)
        return None

    def set_retry(self, operation: str, policy: RetryPolicy) -> None:
        self._retry_by_op[operation] = policy

    def set_timeout(self, operation: str, policy: TimeoutPolicy) -> None:
        self._timeout_by_op[operation] = policy
