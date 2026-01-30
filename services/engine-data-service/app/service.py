"""Adapter layer for engine-data-service."""
from typing import Any


def query(query_spec: dict[str, Any]) -> dict[str, Any]:
    return {"results": [], "count": 0}


def index(payload: dict[str, Any]) -> dict[str, Any]:
    return {"status": "accepted", "indexed": 0}
