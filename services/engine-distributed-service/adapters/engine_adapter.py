"""Connects engine-distributed-service to engine-core contracts."""
from typing import Any


def bind_distributed_port() -> Any:
    return None


def replicate_via_engine(payload: dict[str, Any]) -> dict[str, Any]:
    port = bind_distributed_port()
    if port is not None:
        return port.replicate(payload)
    return {"status": "accepted", "replicated": 0}
