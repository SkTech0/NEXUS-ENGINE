"""
Engine AI — Inference observability (ERL-4).
Latency tracking, model_id, trace_id in logs.
"""
from __future__ import annotations

import time
from typing import Any

from inference.inference_service import InferenceRequest, InferenceResponse, InferenceService


def infer_with_observability(
    service: InferenceService,
    request: InferenceRequest,
    *,
    trace_id: str = "",
    logger: Any = None,
) -> InferenceResponse:
    """
    Run inference with latency and optional structured logging.
    Does not change inference behavior.
    """
    start = time.perf_counter()
    try:
        out = service.infer(request)
        if logger is not None and hasattr(logger, "info"):
            logger.info(
                "inference",
                {
                    "trace_id": trace_id,
                    "model_id": request.model_id,
                    "latency_ms": out.latency_ms,
                    "status": "ok",
                },
            )
        return out
    except Exception as e:
        latency_ms = (time.perf_counter() - start) * 1000
        if logger is not None and hasattr(logger, "error"):
            logger.error(
                "inference",
                {"trace_id": trace_id, "model_id": request.model_id, "latency_ms": latency_ms, "message": str(e)},
            )
        raise
