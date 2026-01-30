"""HTTP layer: /api/Data/query, /api/Data/index, /health."""
from typing import Any
from fastapi import APIRouter
from .health import get_health
from . import service as svc

api = APIRouter(prefix="/api", tags=["Data"])


@api.post("/Data/query")
def data_query(body: dict[str, Any]) -> dict[str, Any]:
    return svc.query(body.get("query") or body or {})


@api.post("/Data/index")
def data_index(body: dict[str, Any]) -> dict[str, Any]:
    return svc.index(body or {})


@api.get("/Data/health")
def data_health() -> dict[str, Any]:
    return get_health()


def mount_health_root(app: "FastAPI") -> None:
    @app.get("/health")
    def health() -> dict[str, Any]:
        return get_health()
