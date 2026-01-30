"""
Engine AI — Error model (ERL-4).
Standard error types; unified mapping; non-crashing handling.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

ERROR_CODES = ("VALIDATION", "ENGINE", "DEPENDENCY", "TIMEOUT", "EXECUTION")
ERROR_TYPES = ("ValidationError", "EngineError", "DependencyError", "TimeoutError", "ExecutionError")


@dataclass(frozen=True)
class EngineErrorPayload:
    code: str
    type: str
    message: str
    details: dict[str, Any] = field(default_factory=dict)
    cause: str | None = None
    trace_id: str | None = None


class BaseEngineError(Exception):
    retryable: bool = False
    code: str = "ENGINE"
    type: str = "EngineError"

    def __init__(
        self,
        message: str,
        *,
        details: dict[str, Any] | None = None,
        cause: str | None = None,
        trace_id: str | None = None,
        retryable: bool = False,
    ) -> None:
        super().__init__(message)
        self._details = details or {}
        self._cause = cause
        self._trace_id = trace_id
        self.retryable = retryable

    def to_payload(self) -> EngineErrorPayload:
        return EngineErrorPayload(
            code=self.code,
            type=self.type,
            message=str(self),
            details=dict(self._details),
            cause=self._cause,
            trace_id=self._trace_id,
        )


class ValidationError(BaseEngineError):
    code = "VALIDATION"
    type = "ValidationError"
    retryable = False


class EngineError(BaseEngineError):
    code = "ENGINE"
    type = "EngineError"


class DependencyError(BaseEngineError):
    code = "DEPENDENCY"
    type = "DependencyError"
    retryable = True


class TimeoutError(BaseEngineError):
    code = "TIMEOUT"
    type = "TimeoutError"
    retryable = True


class ExecutionError(BaseEngineError):
    code = "EXECUTION"
    type = "ExecutionError"
