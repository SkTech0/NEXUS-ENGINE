"""
Tenant manager — multi-tenant: create, get, list, deactivate tenants.
Re-exports from tenancy package. Use: from tenant_manager import TenantManager, create_tenant_manager.
"""
from tenancy.tenant_manager import (
    Tenant,
    TenantManager,
    create_tenant_manager,
)

__all__ = ["Tenant", "TenantManager", "create_tenant_manager"]
