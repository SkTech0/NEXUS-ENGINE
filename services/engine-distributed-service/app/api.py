"""HTTP layer: /api/Distributed/replicate, /api/Distributed/coordinate, /health."""
from typing import Any
from fastapi import APIRouter
from .health import get_health
from . import service as svc

api = APIRouter(prefix="/api", tags=["Distributed"])


@api.post("/Distributed/replicate")
def distributed_replicate(body: dict[str, Any]) -> dict[str, Any]:
    """
    Replicate entries to the distributed log.
    Payload: { entries?: [{term, data}], nodeId?, syncFrom?: {fromIndex, entries} }
    Returns: { status, replicated, lastIndex?, term? }
    """
    return svc.replicate(body or {})


@api.post("/Distributed/coordinate")
def distributed_coordinate(body: dict[str, Any]) -> dict[str, Any]:
    """
    Coordinate: leader election, distributed lock.
    Payload: { action: "elect"|"lock"|"unlock"|"status", nodeIds?, lockId?, holder?, ttlSeconds? }
    Returns: { status, coordinated, leaderId?, term?, acquired?, released? }
    """
    return svc.coordinate(body or {})


@api.get("/Distributed/health")
def distributed_health() -> dict[str, Any]:
    return get_health()


def mount_health_root(app: "FastAPI") -> None:
    @app.get("/health")
    def health() -> dict[str, Any]:
        return get_health()
