"""
Service layer: binds HTTP to engine-optimization domain via domain_facade.

Uses validation, solvers, heuristics, schedulers, allocators; maps domain errors
to API responses. Enterprise: structured logging, non-crashing error handling.
"""
from __future__ import annotations

import logging
from typing import Any

_logger = logging.getLogger("engine-optimization-service")


def optimize(target_id: str, objective: str, constraints: dict[str, Any]) -> dict[str, Any]:
    """
    Run optimization for target_id with objective and constraints.
    Returns { targetId, value, feasible } per API contract.
    """
    try:
        from app.domain_facade import optimize as domain_optimize
        return domain_optimize(
            target_id=target_id or "default",
            objective=objective or "",
            constraints=constraints if isinstance(constraints, dict) else {},
        )
    except RuntimeError as e:
        if "not initialized" in str(e).lower():
            _logger.warning("optimization engine unavailable: %s", e)
            return {"targetId": target_id or "default", "value": 0.0, "feasible": False}
        raise
    except Exception as e:
        err_response = _domain_error_response(e, "optimize")
        if err_response is not None:
            return err_response
        raise


def _domain_error_response(ex: Exception, operation: str) -> dict[str, Any] | None:
    """
    Map domain errors to API response bodies. Returns dict for known engine errors
    so HTTP contract stays unchanged; returns None to re-raise.
    """
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
            return {
                "targetId": "unknown",
                "value": 0.0,
                "feasible": False,
                "error": payload.code,
                "message": payload.message,
                "details": payload.details,
            }
    except ImportError:
        pass
    return None
