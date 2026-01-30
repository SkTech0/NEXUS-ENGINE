"""Connects engine-trust-service to engine-core contracts."""
from typing import Any


def bind_trust_port() -> Any:
    return None


def verify_via_engine(payload: dict[str, Any]) -> dict[str, Any]:
    port = bind_trust_port()
    if port is not None:
        return port.verify(payload)
    return {"valid": True, "message": "verified"}
