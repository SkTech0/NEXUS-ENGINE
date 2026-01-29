"""
Inference service — run predictions from a model and inputs.
Modular, testable.
"""
import time
from dataclasses import dataclass
from typing import Any, Callable


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
    Testable.
    """

    def __init__(self) -> None:
        self._get_model: Callable[[str], Any] | None = None
        self._predict: Callable[[Any, dict[str, Any]], dict[str, Any]] | None = None

    def set_model_loader(self, fn: Callable[[str], Any]) -> None:
        """Set (model_id) -> model. Testable."""
        self._get_model = fn

    def set_predict_fn(self, fn: Callable[[Any, dict[str, Any]], dict[str, Any]]) -> None:
        """Set (model, inputs) -> outputs. Testable."""
        self._predict = fn

    def infer(self, request: InferenceRequest) -> InferenceResponse:
        """Run inference. Testable."""
        start = time.perf_counter()
        model = self._get_model(request.model_id) if self._get_model else None
        outputs = (
            self._predict(model, request.inputs)
            if self._predict and model is not None
            else {}
        )
        latency_ms = (time.perf_counter() - start) * 1000
        return InferenceResponse(
            outputs=outputs,
            latency_ms=latency_ms,
            model_id=request.model_id,
        )


def create_inference_service() -> InferenceService:
    """Create inference service. Testable."""
    return InferenceService()
