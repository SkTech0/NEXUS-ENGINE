"""
Integration engine — register and invoke integrations (webhooks, adapters).
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class IntegrationConfig:
    """Integration config: endpoint, auth, headers."""

    endpoint: str = ""
    auth: dict[str, str] = field(default_factory=dict)
    headers: dict[str, str] = field(default_factory=dict)


@dataclass
class Integration:
    """Integration: id, type, config, invoke fn."""

    id: str
    type: str
    config: IntegrationConfig = field(default_factory=IntegrationConfig)
    invoke_fn: Callable[[Any], Any] | None = None


class IntegrationEngine:
    """
    Integration engine: register, get, invoke.
    Testable.
    """

    def __init__(self) -> None:
        self._integrations: dict[str, Integration] = {}

    def register(self, integration: Integration) -> None:
        """Register integration. Testable."""
        self._integrations[integration.id] = integration

    def get(self, integration_id: str) -> Integration | None:
        """Get integration by id. Testable."""
        return self._integrations.get(integration_id)

    def invoke(self, integration_id: str, payload: Any) -> Any:
        """Invoke integration; returns result of invoke_fn. Testable."""
        integration = self._integrations.get(integration_id)
        if integration is None:
            raise KeyError(f"Integration not found: {integration_id}")
        if integration.invoke_fn is not None:
            return integration.invoke_fn(payload)
        return None

    def list_integrations(self, type_filter: str | None = None) -> list[Integration]:
        """List integrations; optional type filter. Testable."""
        if type_filter is None:
            return list(self._integrations.values())
        return [i for i in self._integrations.values() if i.type == type_filter]


def create_integration_engine() -> IntegrationEngine:
    """Create integration engine. Testable."""
    return IntegrationEngine()
