"""
Engine AI — Enterprise logger (ERL-4).
Structured logging, correlation IDs, latency, engine identity.
"""
from __future__ import annotations

import logging
import time
from dataclasses import asdict, dataclass, field
from typing import Any

ENGINE_NAME = "engine-ai"
ENGINE_VERSION = "1.0.0"


@dataclass
class LogEntry:
    trace_id: str
    engine_name: str
    engine_version: str
    operation: str
    status: str
    latency_ms: float | None = None
    error_code: str | None = None
    error_type: str | None = None
    message: str | None = None
    timestamp: str = field(default_factory=lambda: time.strftime("%Y-%m-%dT%H:%M:%S.%fZ", time.gmtime()))
    correlation_id: str | None = None
    extra: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        d = asdict(self)
        d.pop("extra", None)
        d.update(self.extra)
        return {k: v for k, v in d.items() if v is not None}


class EnterpriseLogger:
    def __init__(
        self,
        engine_name: str = ENGINE_NAME,
        engine_version: str = ENGINE_VERSION,
        logger: logging.Logger | None = None,
    ) -> None:
        self.engine_name = engine_name
        self.engine_version = engine_version
        self._log = logger or logging.getLogger(engine_name)
        self._trace_id = None
        self._correlation_id = None

    def with_trace(self, trace_id: str, correlation_id: str | None = None) -> EnterpriseLogger:
        out = EnterpriseLogger(self.engine_name, self.engine_version, self._log)
        out._trace_id = trace_id
        out._correlation_id = correlation_id
        return out

    def _entry(
        self,
        operation: str,
        status: str,
        *,
        latency_ms: float | None = None,
        error_code: str | None = None,
        error_type: str | None = None,
        message: str | None = None,
        **extra: Any,
    ) -> dict[str, Any]:
        e = LogEntry(
            trace_id=self._trace_id or "",
            engine_name=self.engine_name,
            engine_version=self.engine_version,
            operation=operation,
            status=status,
            latency_ms=latency_ms,
            error_code=error_code,
            error_type=error_type,
            message=message,
            correlation_id=self._correlation_id,
            extra=extra,
        )
        return e.to_dict()

    def info(self, operation: str, entry: dict[str, Any] | None = None) -> None:
        self._log.info("%s", self._entry(operation, "ok", **(entry or {})))

    def warn(self, operation: str, entry: dict[str, Any] | None = None) -> None:
        self._log.warning("%s", self._entry(operation, "degraded", **(entry or {})))

    def error(self, operation: str, entry: dict[str, Any] | None = None) -> None:
        self._log.error("%s", self._entry(operation, "error", **(entry or {})))

    def debug(self, operation: str, entry: dict[str, Any] | None = None) -> None:
        self._log.debug("%s", self._entry(operation, "ok", **(entry or {})))
