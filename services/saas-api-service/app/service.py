"""
Use saas-layer backend logic (tenants, usage).
Ensures saas-layer is on path when run from service dir; uses in-memory stores for demo.
"""
import sys
from pathlib import Path

# Add saas-layer so tenancy, usage packages can be imported (run from services/saas-api-service)
# __file__ = .../services/saas-api-service/app/service.py -> parents[3] = repo root
_root = Path(__file__).resolve().parents[3]
_saas = _root / "saas-layer"
if _saas.exists() and str(_saas) not in sys.path:
    sys.path.insert(0, str(_saas))

from tenancy.tenant_manager import TenantManager, Tenant, create_tenant_manager
from usage.usage_tracker import UsageTracker, UsageSummary, create_usage_tracker

# In-memory singletons for demo; replace with DB-backed adapters in production
_tenant_manager: TenantManager | None = None
_usage_tracker: UsageTracker | None = None


def get_tenant_manager() -> TenantManager:
    global _tenant_manager
    if _tenant_manager is None:
        _tenant_manager = create_tenant_manager()
    return _tenant_manager


def get_usage_tracker() -> UsageTracker:
    global _usage_tracker
    if _usage_tracker is None:
        _usage_tracker = create_usage_tracker()
    return _usage_tracker


def list_tenants_active() -> list[dict]:
    m = get_tenant_manager()
    return [
        {"id": t.id, "name": t.name, "plan": t.plan, "active": t.active, "metadata": t.metadata}
        for t in m.list_active()
    ]


def create_tenant(tenant_id: str, name: str, plan: str = "default") -> dict | None:
    m = get_tenant_manager()
    t = m.create(tenant_id=tenant_id, name=name, plan=plan)
    return {"id": t.id, "name": t.name, "plan": t.plan, "active": t.active, "metadata": t.metadata}


def get_tenant(tenant_id: str) -> dict | None:
    m = get_tenant_manager()
    t = m.get(tenant_id)
    if t is None:
        return None
    return {"id": t.id, "name": t.name, "plan": t.plan, "active": t.active, "metadata": t.metadata}


def get_usage_summary(tenant_id: str) -> list[dict]:
    u = get_usage_tracker()
    summaries = u.get_summary(tenant_id)
    return [
        {"tenant_id": s.tenant_id, "metric": s.metric, "total": s.total, "unit": s.unit}
        for s in summaries
    ]


def record_usage(tenant_id: str, metric: str, value: float, unit: str = "count") -> dict:
    u = get_usage_tracker()
    rec = u.record(tenant_id=tenant_id, metric=metric, value=value, unit=unit)
    return {
        "tenant_id": rec.tenant_id,
        "metric": rec.metric,
        "value": rec.value,
        "unit": rec.unit,
        "timestamp": getattr(rec, "timestamp", None),
    }
