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


def submit_training(config: dict[str, Any]) -> dict[str, Any]:
    """Submit training job. Returns jobId. Runs training in background thread."""
    from .training import get_job_queue
    from .training.runner import run_training_job
    import threading

    queue = get_job_queue()
    job_id = queue.submit(config=config)
    thread = threading.Thread(target=run_training_job, args=(job_id, config))
    thread.daemon = True
    thread.start()
    return {"status": "accepted", "jobId": job_id, "message": "Training started. Poll /train/{jobId}/status for progress."}


def get_training_status(job_id: str) -> dict[str, Any]:
    """Get training job status."""
    from .training import get_job_queue

    queue = get_job_queue()
    return queue.get_status(job_id)
