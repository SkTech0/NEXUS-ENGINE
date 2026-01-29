"""Tenancy: tenant manager (canonical)."""
from .tenant_manager import (
    Tenant,
    TenantManager,
    create_tenant_manager,
)
__all__ = ["Tenant", "TenantManager", "create_tenant_manager"]
