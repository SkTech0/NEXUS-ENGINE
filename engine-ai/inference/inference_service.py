"""
Inference service — run predictions from a model and inputs.
Enterprise: validation, logging, error handling (ERL-4).
"""
from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Any, Callable

from errors.error_model import ExecutionError, ValidationError
from observability.enterprise_logger import EnterpriseLogger
from validation.inference_validation import validate_inference_request


@dataclass
class InferenceRequest:
    """Request: model_id, inputs, optional options."""

    model_id: str
    inputs: dict[str, Any]
    options: dict[str, Any] | None = None


@dataclass
class InferenceResponse:
    """Response: outputs, latency_ms, model_id."""

    outputs: dict[str, Any]
    latency_ms: float = 0.0
    model_id: str = ""


class InferenceService:
    """
    Inference: set model loader and predict fn; infer(request) returns response.
    Enterprise: validation, structured logging, safe error handling.
    """

    def __init__(
        self,
        *,
        logger: EnterpriseLogger | None = None,
        model_exists: Callable[[str], bool] | None = None,
    ) -> None:
        self._get_model: Callable[[str], Any] | None = None
        self._predict: Callable[[Any, dict[str, Any]], dict[str, Any]] | None = None
        self._logger = logger or EnterpriseLogger()
        self._model_exists = model_exists

    def set_model_loader(self, fn: Callable[[str], Any]) -> None:
        """Set (model_id) -> model. Testable."""
        self._get_model = fn

    def set_predict_fn(self, fn: Callable[[Any, dict[str, Any]], dict[str, Any]]) -> None:
        """Set (model, inputs) -> outputs. Testable."""
        self._predict = fn

    def infer(self, request: InferenceRequest) -> InferenceResponse:
        """Run inference with validation, logging, and error handling."""
        start = time.perf_counter()
        result = validate_inference_request(request, model_exists=self._model_exists)
        if not result.valid:
            issues = "; ".join(i.message or i.code or "invalid" for i in result.issues)
            self._logger.error("infer", {"message": issues, "error_code": "VALIDATION", "error_type": "ValidationError"})
            raise ValidationError(issues, details={"issues": [{"code": i.code, "message": i.message} for i in result.issues]})

        model = None
        try:
            model = self._get_model(request.model_id) if self._get_model else None
            outputs = (
                self._predict(model, request.inputs)
                if self._predict and model is not None
                else {}
            )
        except ValidationError:
            raise
        except Exception as e:
            latency_ms = (time.perf_counter() - start) * 1000
            self._logger.error(
                "infer",
                {"message": str(e), "latency_ms": latency_ms, "error_code": "EXECUTION", "error_type": "ExecutionError"},
            )
            raise ExecutionError(str(e), cause=type(e).__name__, retryable=True) from e

        latency_ms = (time.perf_counter() - start) * 1000
        self._logger.info("infer", {"latency_ms": latency_ms, "model_id": request.model_id})
        return InferenceResponse(
            outputs=outputs,
            latency_ms=latency_ms,
            model_id=request.model_id,
        )


def create_inference_service(
    logger: EnterpriseLogger | None = None,
    model_exists: Callable[[str], bool] | None = None,
) -> InferenceService:
    """Create inference service. Enterprise-ready with optional logger and model check."""
    return InferenceService(logger=logger, model_exists=model_exists)
