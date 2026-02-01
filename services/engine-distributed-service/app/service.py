"""
Service layer: binds HTTP to engine-distributed domain via domain_facade.

Uses replication, coordination (leader election, distributed lock); maps domain
errors to API responses. Enterprise: structured logging, payload validation.
"""
from __future__ import annotations

import logging
from typing import Any

_logger = logging.getLogger("engine-distributed-service")


def replicate(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Replicate entries to the distributed log.
    Returns { status, replicated, lastIndex?, term? } per API contract.
    """
    try:
        from app.domain_facade import replicate as domain_replicate
        return domain_replicate(payload or {})
    except RuntimeError as e:
        if "not initialized" in str(e).lower():
            _logger.warning("distributed engine unavailable: %s", e)
            return {"status": "error", "replicated": 0, "error": "ENGINE_UNAVAILABLE", "message": str(e)}
        raise
    except Exception as e:
        err_response = _domain_error_response(e, "replicate")
        if err_response is not None:
            return err_response
        raise


def coordinate(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Coordinate: leader election, lock acquire/release.
    Returns { status, coordinated, ... } per API contract.
    """
    try:
        from app.domain_facade import coordinate as domain_coordinate
        return domain_coordinate(payload or {})
    except RuntimeError as e:
        if "not initialized" in str(e).lower():
            _logger.warning("distributed engine unavailable: %s", e)
            return {"status": "error", "coordinated": False, "error": "ENGINE_UNAVAILABLE", "message": str(e)}
        raise
    except Exception as e:
        err_response = _domain_error_response(e, "coordinate")
        if err_response is not None:
            return err_response
        raise


def _domain_error_response(ex: Exception, operation: str) -> dict[str, Any] | None:
    """Map domain errors to API response bodies."""
    try:
        from errors.error_model import BaseEngineError
        if isinstance(ex, BaseEngineError):
            _logger.warning(
                "domain_error operation=%s code=%s message=%s",
                operation,
                ex.code,
                ex,
            )
            payload = ex.to_payload()
            base = {"status": "error", "coordinated": False} if operation == "coordinate" else {"status": "error", "replicated": 0}
            return {
                **base,
                "error": payload.code,
                "message": payload.message,
                "details": payload.details,
            }
    except ImportError:
        pass
    return None
