"""HTTP layer: /api/Intelligence/evaluate, /api/Engine/execute, /health."""
from typing import Any
from fastapi import APIRouter
from .health import get_health
from . import service as svc

api = APIRouter(prefix="/api", tags=["Intelligence", "Engine"])


@api.post("/Intelligence/evaluate")
def intelligence_evaluate(body: dict[str, Any]) -> dict[str, Any]:
    context = body.get("context") or ""
    inputs = body.get("inputs") or {}
    return svc.evaluate(context, inputs if isinstance(inputs, dict) else {})


@api.post("/Engine/execute")
def engine_execute(body: dict[str, Any]) -> dict[str, Any]:
    action = body.get("action") or "default"
    parameters = body.get("parameters") or {}
    return svc.execute(action, parameters if isinstance(parameters, dict) else {})


@api.get("/Intelligence/health")
def intelligence_health() -> dict[str, Any]:
    return get_health()


def mount_health_root(app: "FastAPI") -> None:
    @app.get("/health")
    def health() -> dict[str, Any]:
        return get_health()
