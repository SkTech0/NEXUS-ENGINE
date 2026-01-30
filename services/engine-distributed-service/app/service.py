"""Adapter layer for engine-distributed-service."""
from typing import Any


def replicate(payload: dict[str, Any]) -> dict[str, Any]:
    return {"status": "accepted", "replicated": 0}


def coordinate(payload: dict[str, Any]) -> dict[str, Any]:
    return {"status": "ok", "coordinated": True}
