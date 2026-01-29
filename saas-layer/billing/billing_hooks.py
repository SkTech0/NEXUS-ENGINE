"""
Billing hooks — SaaS-layer hooks that delegate to monetization.
Single responsibility: bridge subscription events to billing engine.
Does not contain billing logic; monetization owns pricing/billing/invoicing.
"""
from typing import Any, Callable


def create_on_subscribe_hook(billing_callback: Callable[[str, str], Any] | None) -> Callable[[str, str], None]:
    """Create hook for subscribe events; call billing_callback(tenant_id, plan_id) if set."""
    def hook(tenant_id: str, plan_id: str) -> None:
        if billing_callback is not None:
            billing_callback(tenant_id, plan_id)
    return hook


def create_on_cancel_hook(billing_callback: Callable[[str], Any] | None) -> Callable[[str], None]:
    """Create hook for cancel events; call billing_callback(tenant_id) if set."""
    def hook(tenant_id: str) -> None:
        if billing_callback is not None:
            billing_callback(tenant_id)
    return hook
