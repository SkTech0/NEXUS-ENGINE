"""Connects engine-data-service to engine-core contracts."""
from typing import Any


def bind_data_port() -> Any:
    return None


def query_via_engine(query_spec: dict[str, Any]) -> dict[str, Any]:
    port = bind_data_port()
    if port is not None:
        return port.query(query_spec)
    return {"results": [], "count": 0}
