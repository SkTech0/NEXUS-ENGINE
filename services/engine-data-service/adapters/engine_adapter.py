"""Connects engine-data-service to engine-core contracts."""
from typing import Any


def bind_data_port() -> Any:
    """Reserved for future port binding. Returns None."""
    return None


def query_via_engine(query_spec: dict[str, Any]) -> dict[str, Any]:
    """Query via bound port or, when no port, via service layer (domain facade)."""
    port = bind_data_port()
    if port is not None:
        return port.query(query_spec)
    from app import service as svc
    return svc.query(query_spec or {})
