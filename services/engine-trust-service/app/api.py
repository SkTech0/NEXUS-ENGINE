"""HTTP layer: /api/Trust/verify, /api/Trust/health, /api/Trust/demo-token, /health."""
from typing import Any
from fastapi import APIRouter
from .health import get_health
from . import service as svc
from .verification.jwt_verifier import generate_demo_jwt

api = APIRouter(prefix="/api", tags=["Trust"])


@api.get("/Trust/demo-token")
def trust_demo_token() -> dict[str, Any]:
    """Generate a demo JWT signed with TRUST_JWT_SECRET. Works in prod when secret is set."""
    token = generate_demo_jwt()
    if token is None:
        return {"token": None, "message": "TRUST_JWT_SECRET not configured"}
    return {"token": token}


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
