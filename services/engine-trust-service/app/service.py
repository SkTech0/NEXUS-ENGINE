"""Adapter layer for engine-trust-service."""
from typing import Any


def verify(payload: dict[str, Any]) -> dict[str, Any]:
    return {"valid": True, "message": "verified"}


def get_score(entity_id: str) -> dict[str, Any]:
    return {"entityId": entity_id, "score": 0.8, "source": "default"}
