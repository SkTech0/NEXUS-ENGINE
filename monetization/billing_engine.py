"""
Billing engine — generate billing events, cycles, and amounts.
Modular, testable.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class BillingCycle(Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


@dataclass
class BillingEvent:
    """A billing event: tenant_id, cycle, amount_cents, line_items."""

    tenant_id: str
    cycle: BillingCycle
    amount_cents: int
    line_items: list[dict[str, Any]] = field(default_factory=list)


@dataclass
class BillingConfig:
    """Billing config: cycle, currency."""

    cycle: BillingCycle = BillingCycle.MONTHLY
    currency: str = "USD"


class BillingEngine:
    """
    Billing: set config; create_event(tenant_id, amount_cents, line_items) returns event.
    Testable.
    """

    def __init__(self) -> None:
        self._config = BillingConfig()
        self._events: list[BillingEvent] = []

    def set_config(self, config: BillingConfig) -> None:
        """Set billing config. Testable."""
        self._config = config

    def get_config(self) -> BillingConfig:
        """Get current config. Testable."""
        return self._config

    def create_event(
        self,
        tenant_id: str,
        amount_cents: int,
        line_items: list[dict[str, Any]] | None = None,
    ) -> BillingEvent:
        """Create and store billing event. Testable."""
        event = BillingEvent(
            tenant_id=tenant_id,
            cycle=self._config.cycle,
            amount_cents=amount_cents,
            line_items=line_items or [],
        )
        self._events.append(event)
        return event

    def list_events(self, tenant_id: str | None = None) -> list[BillingEvent]:
        """List events, optionally by tenant. Testable."""
        if tenant_id is None:
            return list(self._events)
        return [e for e in self._events if e.tenant_id == tenant_id]


def create_billing_engine() -> BillingEngine:
    """Create billing engine. Testable."""
    return BillingEngine()
