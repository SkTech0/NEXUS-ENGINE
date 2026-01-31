"""
Adapter layer for engine-ai-service.
Uses real ML models: risk (default) and sentiment.
"""
import time
from typing import Any

from .models.predictor import infer_with_model


def infer(model_id: str, inputs: dict[str, Any]) -> dict[str, Any]:
    """Run inference with real model. Returns outputs, latencyMs, modelId."""
    start = time.perf_counter()
    model_id = model_id or "default"
    inputs = inputs if isinstance(inputs, dict) else {}

    outputs = infer_with_model(model_id, inputs)
    latency_ms = (time.perf_counter() - start) * 1000

    return {"outputs": outputs, "latencyMs": round(latency_ms, 2), "modelId": model_id}


def list_models() -> dict[str, Any]:
    return {"modelIds": ["default", "risk", "sentiment"]}
