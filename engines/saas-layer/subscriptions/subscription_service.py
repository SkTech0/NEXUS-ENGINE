"""
Subscription service — plans, subscribe, cancel; billing hooks.
Canonical location: saas-layer/subscriptions. Modular, testable.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable


class SubscriptionStatus(Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    PAST_DUE = "past_due"
    TRIAL = "trial"


@dataclass
class Plan:
    """A plan: id, name, price_cents, interval."""

    id: str
    name: str
    price_cents: int = 0
    interval: str = "month"


@dataclass
class Subscription:
    """A subscription: tenant_id, plan_id, status."""

    tenant_id: str
    plan_id: str
    status: SubscriptionStatus = SubscriptionStatus.ACTIVE


class SubscriptionService:
    """
    Subscription: plans, subscribe, cancel; optional billing hooks (on_subscribe, on_cancel).
    Testable.
    """

    def __init__(self) -> None:
        self._plans: dict[str, Plan] = {}
        self._subscriptions: dict[str, Subscription] = {}
        self._on_subscribe: Callable[[str, str], None] | None = None
        self._on_cancel: Callable[[str], None] | None = None

    def add_plan(self, plan: Plan) -> None:
        """Register plan. Testable."""
        self._plans[plan.id] = plan

    def get_plan(self, plan_id: str) -> Plan | None:
        """Get plan by id. Testable."""
        return self._plans.get(plan_id)

    def subscribe(self, tenant_id: str, plan_id: str) -> Subscription | None:
        """Create or update subscription. Fires on_subscribe hook. Testable."""
        if plan_id not in self._plans:
            return None
        sub = Subscription(tenant_id=tenant_id, plan_id=plan_id)
        self._subscriptions[tenant_id] = sub
        if self._on_subscribe is not None:
            self._on_subscribe(tenant_id, plan_id)
        return sub

    def cancel(self, tenant_id: str) -> bool:
        """Cancel subscription. Fires on_cancel hook. Testable."""
        sub = self._subscriptions.get(tenant_id)
        if sub is None:
            return False
        sub.status = SubscriptionStatus.CANCELLED
        if self._on_cancel is not None:
            self._on_cancel(tenant_id)
        return True

    def get_subscription(self, tenant_id: str) -> Subscription | None:
        """Get subscription by tenant. Testable."""
        return self._subscriptions.get(tenant_id)

    def set_billing_hook_subscribe(self, fn: Callable[[str, str], None]) -> None:
        """Set billing hook: on subscribe. Testable."""
        self._on_subscribe = fn

    def set_billing_hook_cancel(self, fn: Callable[[str], None]) -> None:
        """Set billing hook: on cancel. Testable."""
        self._on_cancel = fn


def create_subscription_service() -> SubscriptionService:
    """Create subscription service. Testable."""
    return SubscriptionService()
