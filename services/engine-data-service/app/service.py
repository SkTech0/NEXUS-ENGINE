"""
Service layer: binds HTTP to engine-data domain via domain_facade.
Uses validation, pipelines, indexing, storage, caching; maps domain errors to responses.
"""
from __future__ import annotations

import logging
from typing import Any

_logger = logging.getLogger("engine-data-service")


def query(query_spec: dict[str, Any]) -> dict[str, Any]:
    """
    Query using indexing + cache. Validates input via validation_layer;
    returns real results from index search, optionally cached.
    """
    try:
        from app.domain_facade import query_documents
        return query_documents(query_spec or {})
    except RuntimeError as e:
        if "not initialized" in str(e).lower():
            return {"results": [], "count": 0, "error": "ENGINE_UNAVAILABLE", "message": str(e)}
        raise
    except Exception as e:
        err_response = _domain_error_response(e, "query")
        if err_response is not None:
            return err_response
        raise


def index(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Ingest via pipeline (validate -> store -> index). Validates payload;
    returns status and real indexed count.
    """
    try:
        from app.domain_facade import index_documents
        out = index_documents(payload or {})
        indexed = out.get("indexed", 0)
        errors = out.get("errors", [])
        return {
            "status": "accepted",
            "indexed": indexed,
            **({"errors": errors} if errors else {}),
        }
    except RuntimeError as e:
        if "not initialized" in str(e).lower():
            return {"status": "error", "indexed": 0, "error": "ENGINE_UNAVAILABLE", "message": str(e)}
        raise
    except Exception as e:
        err_response = _domain_error_response(e, "index")
        if err_response is not None:
            return err_response
        raise


def _domain_error_response(ex: Exception, operation: str) -> dict[str, Any] | None:
    """
    Map domain errors to response bodies. Returns a dict for known engine errors
    so HTTP contract stays unchanged; returns None to re-raise.
    """
    try:
        from errors.error_model import BaseEngineError
        if isinstance(ex, BaseEngineError):
            _logger.warning("domain_error operation=%s code=%s message=%s", operation, ex.code, ex)
            payload = ex.to_payload()
            if operation == "query":
                return {
                    "results": [],
                    "count": 0,
                    "error": payload.code,
                    "message": payload.message,
                    "details": payload.details,
                }
            return {
                "status": "error",
                "indexed": 0,
                "error": payload.code,
                "message": payload.message,
                "details": payload.details,
            }
    except ImportError:
        pass
    return None
