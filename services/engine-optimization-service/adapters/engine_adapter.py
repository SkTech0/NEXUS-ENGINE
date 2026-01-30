"""Connects engine-optimization-service to engine-core contracts."""
from typing import Any


def bind_optimization_port() -> Any:
    return None


def optimize_via_engine(target_id: str, objective: str, constraints: dict[str, Any]) -> dict[str, Any]:
    port = bind_optimization_port()
    if port is not None:
        return port.optimize(target_id, objective, constraints)
    return {"targetId": target_id, "value": 0.0, "feasible": True}
