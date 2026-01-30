"""HTTP layer: /api/Trust/verify, /api/Trust/health, /health."""
from typing import Any
from fastapi import APIRouter
from .health import get_health
from . import service as svc

api = APIRouter(prefix="/api", tags=["Trust"])


@api.post("/Trust/verify")
def trust_verify(body: dict[str, Any]) -> dict[str, Any]:
    return svc.verify(body or {})


@api.get("/Trust/score/{entity_id}")
def trust_score(entity_id: str) -> dict[str, Any]:
    return svc.get_score(entity_id)


@api.get("/Trust/health")
def trust_health() -> dict[str, Any]:
    return get_health()


def mount_health_root(app: "FastAPI") -> None:
    @app.get("/health")
    def health() -> dict[str, Any]:
        return get_health()
