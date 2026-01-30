"""
HTTP layer for engine-ai-service.
Exposes /api/AI/infer, /api/AI/train, /health.
"""
from typing import Any

from fastapi import APIRouter
from .health import get_health
from . import service as svc

api = APIRouter(prefix="/api/AI", tags=["AI"])


@api.post("/infer")
def ai_infer(body: dict[str, Any]) -> dict[str, Any]:
    model_id = body.get("modelId") or body.get("model_id") or "default"
    inputs = body.get("inputs") or {}
    return svc.infer(model_id, inputs if isinstance(inputs, dict) else {})


@api.post("/train")
def ai_train(body: dict[str, Any]) -> dict[str, Any]:
    """Training endpoint; stub for service boundary."""
    return {"status": "accepted", "jobId": body.get("jobId") or "stub"}


@api.get("/models")
def ai_models() -> dict[str, Any]:
    return svc.list_models()


@api.get("/health")
def ai_health() -> dict[str, Any]:
    return get_health()


def mount_health_root(app: "FastAPI") -> None:
    @app.get("/health")
    def health() -> dict[str, Any]:
        return get_health()
