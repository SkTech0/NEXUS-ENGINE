"""Adapter layer for engine-optimization-service."""
from typing import Any


def optimize(target_id: str, objective: str, constraints: dict[str, Any]) -> dict[str, Any]:
    return {"targetId": target_id, "value": 0.0, "feasible": True}
