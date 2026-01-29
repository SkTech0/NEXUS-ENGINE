"""
Tenant manager — multi-tenant: create, get, list, deactivate tenants.
Canonical location: saas-layer/tenancy. Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Tenant:
    """A tenant: id, name, plan, active, metadata."""

    id: str
    name: str
    plan: str = "default"
    active: bool = True
    metadata: dict[str, Any] = field(default_factory=dict)


class TenantManager:
    """
    In-memory tenant store: create, get, list, deactivate.
    Testable; replace with DB adapter in production.
    """

    def __init__(self) -> None:
        self._tenants: dict[str, Tenant] = {}

    def create(self, tenant_id: str, name: str, plan: str = "default") -> Tenant:
        """Create tenant. Testable."""
        tenant = Tenant(id=tenant_id, name=name, plan=plan)
        self._tenants[tenant_id] = tenant
        return tenant

    def get(self, tenant_id: str) -> Tenant | None:
        """Get tenant by id. Testable."""
        return self._tenants.get(tenant_id)

    def list_active(self) -> list[Tenant]:
        """List active tenants. Testable."""
        return [t for t in self._tenants.values() if t.active]

    def list_by_plan(self, plan: str) -> list[Tenant]:
        """List tenants by plan. Testable."""
        return [t for t in self._tenants.values() if t.plan == plan]

    def deactivate(self, tenant_id: str) -> bool:
        """Deactivate tenant. Returns True if found. Testable."""
        tenant = self._tenants.get(tenant_id)
        if tenant is None:
            return False
        tenant.active = False
        return True

    def update_plan(self, tenant_id: str, plan: str) -> bool:
        """Update tenant plan. Testable."""
        tenant = self._tenants.get(tenant_id)
        if tenant is None:
            return False
        tenant.plan = plan
        return True


def create_tenant_manager() -> TenantManager:
    """Create tenant manager. Testable."""
    return TenantManager()
