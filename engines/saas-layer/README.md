# SaaS Layer

TypeScript (Nx) + Python SaaS modules.

## Python layout

| Subfolder     | File                 | Features                    |
|---------------|----------------------|-----------------------------|
| **tenants**   | tenant_manager.py    | Multi-tenant: create, get, list, deactivate |
| **auth**      | auth_service.py      | Auth + RBAC: verify token, has_role, has_permission |
| **subscription** | subscription_service.py | Subscription: plans, subscribe, cancel; billing hooks |
| **usage**     | usage_tracker.py     | Usage tracking: record, get_total, limits |
| **license**   | license_manager.py   | Licenses: issue, revoke, validate(tenant, feature) |

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
python -c "from tenants import create_tenant_manager; m = create_tenant_manager(); m.create('t1', 'Acme'); print(m.list_active())"
```
