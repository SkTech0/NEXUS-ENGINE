# SaaS Layer

TypeScript (Nx) + Python SaaS modules. Multi-tenant, Auth, RBAC, Subscription, Billing hooks, Usage tracking.

## Python layout

**Root (flat):** Use from repo root with `PYTHONPATH=saas-layer`:

| File                   | Features                                                    |
|------------------------|-------------------------------------------------------------|
| `tenant_manager.py`    | Multi-tenant: create, get, list, deactivate, update_plan   |
| `auth_service.py`      | Auth + RBAC: verify token, has_role, has_permission         |
| `subscription_service.py` | Plans, subscribe, cancel; billing hooks (on_subscribe, on_cancel) |
| `usage_tracker.py`     | Usage tracking: record (with timestamp), get_total, limits |
| `license_manager.py`   | Licenses: issue, revoke, validate(tenant, feature)          |

**Subfolders:** Same logic lives under `tenancy/`, `auth/`, `subscriptions/`, `usage/`, `licensing/`; root files re-export for convenience.

## Features

- **Multi-tenant**: TenantManager — create, get, list_by_plan, deactivate, update_plan
- **Auth**: AuthService — verify(token), Principal, token_validator
- **RBAC**: AuthService — add_role_permission, has_role, has_permission
- **Subscription**: SubscriptionService — plans, subscribe, cancel; set_billing_hook_subscribe / set_billing_hook_cancel
- **Billing hooks**: SubscriptionService — on_subscribe(tenant_id, plan_id), on_cancel(tenant_id)
- **Usage tracking**: UsageTracker — record, get_total, get_summary, set_limit, is_over_limit
- **License**: LicenseManager — issue, revoke, validate(tenant_id, feature)

Run from repo root with `PYTHONPATH=saas-layer`:

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=saas-layer
python -c "from tenant_manager import create_tenant_manager; m = create_tenant_manager(); m.create('t1', 'Acme'); print(m.list_active())"
```
