# Nexus Engine — Cleanup Report

Post-audit report: files removed, merged, moved; duplicates fixed; conflicts resolved.

---

## 1. Files Removed (Duplicates / Redundant)

| File | Reason |
|------|--------|
| engine-core/src/ports/engine-port.ts | Replaced by interfaces/engine-port.ts; single canonical interface |
| engine-core/src/ports/index.ts | Replaced by interfaces/index.ts |
| engine-ai/engine_ai/__init__.py | Duplicate package; inference/models live at engine-ai root |
| engine-ai/engine_ai/application/__init__.py | Duplicate; inference/ is canonical |
| engine-ai/engine_ai/application/inference_service.py | Duplicate; engine-ai/inference/inference_service.py is canonical |
| engine-ai/engine_ai/domain/__init__.py | Duplicate |
| engine-ai/engine_ai/domain/models.py | Duplicate; engine-ai/models/ is canonical |
| engine-ai/engine_ai/domain/ports.py | Duplicate; engine-ai/inference and models are canonical |
| saas-layer/tenants/__init__.py | Legacy; canonical: tenancy |
| saas-layer/tenants/tenant_manager.py | Legacy; canonical: tenancy/tenant_manager.py |
| saas-layer/subscription/__init__.py | Legacy; canonical: subscriptions |
| saas-layer/subscription/subscription_service.py | Legacy; canonical: subscriptions/subscription_service.py |
| saas-layer/license/__init__.py | Legacy; canonical: licensing |
| saas-layer/license/license_manager.py | Legacy; canonical: licensing/license_manager.py |

**Summary**: 14 files removed. No business logic deleted; duplicates consolidated into canonical locations.

---

## 2. Files Merged

| Merged into | Source | Notes |
|-------------|--------|--------|
| engine-core/src/interfaces/engine-port.ts | engine-core/src/ports/engine-port.ts | Same content; ports → interfaces naming |
| engine-core/src/contracts/index.ts | N/A | New; re-exports interfaces (contracts = interfaces for core) |
| engine-core/src/kernel/index.ts | N/A | New; re-exports domain |

No logic merged from two files into one; only re-exports and naming alignment.

---

## 3. Files Moved

| From | To | Notes |
|------|----|--------|
| (new) | engine-core/src/interfaces/engine-port.ts | Canonical interface |
| (new) | engine-core/src/interfaces/index.ts | |
| (new) | engine-core/src/contracts/index.ts | |
| (new) | engine-core/src/kernel/index.ts | |
| (new) | saas-layer/tenancy/tenant_manager.py | Canonical tenancy (tenants → tenancy) |
| (new) | saas-layer/tenancy/__init__.py | |
| (new) | saas-layer/subscriptions/subscription_service.py | Canonical subscriptions |
| (new) | saas-layer/subscriptions/__init__.py | |
| (new) | saas-layer/licensing/license_manager.py | Canonical licensing |
| (new) | saas-layer/licensing/__init__.py | |
| (new) | saas-layer/billing/billing_hooks.py | Billing hooks only; no billing logic |
| (new) | saas-layer/billing/__init__.py | |
| (new) | enterprise/compliance/compliance_engine.py | Canonical compliance subfolder |
| (new) | enterprise/compliance/__init__.py | |
| (new) | docs/system-design/architecture.md | Canonical system-design |
| (new) | docs/system-design/ddd.md | |
| (new) | docs/system-design/README.md | |
| (new) | docs/legal/README.md | Placeholder |
| (new) | infra/k8s/.gitkeep | |
| (new) | infra/terraform/.gitkeep | |
| (new) | infra/helm/.gitkeep | |
| (new) | infra/ci-cd/.gitkeep | |

Legacy saas-layer folders (tenants, subscription, license) were removed after confirming no external imports; canonical packages are tenancy, subscriptions, licensing. Enterprise flat files retained for backward compatibility.

---

## 4. Duplicates Fixed

| Duplicate | Resolution |
|-----------|------------|
| engine-core ports vs interfaces | Single canonical: interfaces. Ports removed. |
| engine-ai engine_ai/ vs engine-ai root (inference, models) | Single canonical: engine-ai/inference, engine-ai/models, etc. engine_ai/ package removed. |
| saas-layer tenants vs tenancy | Canonical: tenancy. tenants/ removed (no external imports). |
| saas-layer subscription vs subscriptions | Canonical: subscriptions. subscription/ removed (no external imports). |
| saas-layer license vs licensing | Canonical: licensing. license/ removed (no external imports). |
| enterprise compliance (flat) vs compliance/ | Canonical: enterprise/compliance/compliance_engine.py. Flat file retained for compat. |

---

## 5. Conflicts Resolved

- **Naming**: ports → interfaces (engine-core); tenants → tenancy, subscription → subscriptions, license → licensing (saas-layer).
- **Placement**: engine_ai application/domain removed; inference and models live only at engine-ai root.
- **Responsibility**: saas-layer/billing contains only billing_hooks (delegate to monetization); no billing logic in SaaS.
- **Docs**: architecture and DDD moved to docs/system-design; legal placeholder added.

---

## 6. Recommended Follow-Up (No Automatic Change)

1. **Done**: Legacy saas-layer folders `tenants/`, `subscription/`, `license/` removed; use `tenancy`, `subscriptions`, `licensing`.
2. **Enterprise**: Move governance_engine.py → governance/, sla_manager.py → sla/, policy_engine.py → policies/, enterprise_auth.py → security/ for full target layout.
3. **Monetization / platform**: Optionally move each engine file into its own subfolder (e.g. pricing/pricing_engine.py) for consistency with other engines.
4. **product-ui**: Optionally group components into shell, dashboard, visualization, monitoring, admin, apps per target; ensure routes and imports updated.
5. **engine-api**: Optionally add Gateway/ folder with gateway-specific options or config; keep Middleware for HTTP middleware.

---

## 7. References

- **ARCHITECTURE_MAP.md** — Target structure and engine map
- **STRUCTURE_VALIDATION.md** — Validation results
- **DEPENDENCY_GRAPH.md** — Dependency graph
