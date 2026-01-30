"""
Pipeline observability (ERL-4).
Wrap pipeline run with logging, latency, error classification.
"""
from __future__ import annotations

import time
from typing import Any, Callable

from pipelines.data_pipeline import DataPipeline  # noqa: I100


def run_with_observability(
    pipeline: DataPipeline,
    initial: Any,
    *,
    operation: str = "pipeline.run",
    trace_id: str = "",
    logger: Any = None,
) -> Any:
    """
    Run pipeline with latency tracking and optional logging.
    Does not change pipeline behavior; adds observability only.
    """
    start = time.perf_counter()
    try:
        out = pipeline.run(initial)
        latency_ms = (time.perf_counter() - start) * 1000
        if logger is not None and hasattr(logger, "info"):
            logger.info(
                operation,
                {
                    "trace_id": trace_id,
                    "status": "ok",
                    "latency_ms": latency_ms,
                    "stages": pipeline.stages(),
                },
            )
        return out
    except Exception as e:
        latency_ms = (time.perf_counter() - start) * 1000
        if logger is not None and hasattr(logger, "error"):
            logger.error(
                operation,
                {
                    "trace_id": trace_id,
                    "status": "error",
                    "latency_ms": latency_ms,
                    "message": str(e),
                },
            )
        raise


def data_corruption_detection_hook(record: dict[str, Any]) -> tuple[bool, str]:
    """
    Optional hook for data corruption detection.
    Returns (valid, message). Override or extend in engines.
    """
    if not isinstance(record, dict):
        return False, "record is not a dict"
    return True, ""
