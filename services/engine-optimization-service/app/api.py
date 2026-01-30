"""HTTP layer: /api/Optimization/optimize, /health."""
from typing import Any
from fastapi import APIRouter
from .health import get_health
from . import service as svc

api = APIRouter(prefix="/api", tags=["Optimization"])


@api.post("/Optimization/optimize")
def optimization_optimize(body: dict[str, Any]) -> dict[str, Any]:
    target_id = body.get("targetId") or "default"
    objective = body.get("objective") or ""
    constraints = body.get("constraints") or {}
    return svc.optimize(target_id, objective, constraints if isinstance(constraints, dict) else {})


@api.get("/Optimization/health")
def optimization_health() -> dict[str, Any]:
    return get_health()


def mount_health_root(app: "FastAPI") -> None:
    @app.get("/health")
    def health() -> dict[str, Any]:
        return get_health()
