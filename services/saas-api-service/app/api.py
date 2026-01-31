"""HTTP API: /api/saas/tenants, /api/saas/tenants/{id}/usage."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from . import service as svc

api = APIRouter(prefix="/api/saas", tags=["SaaS"])


class TenantCreate(BaseModel):
    id: str
    name: str
    plan: str = "default"


class UsageRecordBody(BaseModel):
    metric: str
    value: float
    unit: str = "count"


@api.get("/tenants")
def list_tenants() -> list[dict]:
    return svc.list_tenants_active()


@api.post("/tenants")
def create_tenant(body: TenantCreate) -> dict:
    out = svc.create_tenant(tenant_id=body.id, name=body.name, plan=body.plan)
    if out is None:
        raise HTTPException(status_code=400, detail="Create failed")
    return out


@api.get("/tenants/{tenant_id}")
def get_tenant(tenant_id: str) -> dict:
    out = svc.get_tenant(tenant_id)
    if out is None:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return out


@api.get("/tenants/{tenant_id}/usage")
def get_usage(tenant_id: str) -> list[dict]:
    return svc.get_usage_summary(tenant_id)


@api.post("/tenants/{tenant_id}/usage")
def post_usage(tenant_id: str, body: UsageRecordBody) -> dict:
    return svc.record_usage(
        tenant_id=tenant_id,
        metric=body.metric,
        value=body.value,
        unit=body.unit,
    )


@api.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "saas-api"}
