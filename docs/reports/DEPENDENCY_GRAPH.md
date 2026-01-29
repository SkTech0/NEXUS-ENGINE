# Nexus Engine — Dependency Graph

Engine dependencies, API dependencies, SaaS dependencies, platform dependencies. No circular dependencies.

---

## 1. Engine Dependencies (Runtime)

```
engine-core
  ← (no dependencies on other engines)

engine-distributed
  ← engine-core (interfaces/contracts only; optional)

engine-data
  ← engine-core (optional)

engine-intelligence
  ← engine-core (optional)

engine-optimization
  ← engine-core (optional)

engine-ai
  ← engine-core (optional); exposed via API only

engine-trust
  ← engine-core (optional); independent

engine-api
  ← engine-core, engine-distributed, engine-data, engine-intelligence, engine-optimization, engine-ai, engine-trust
  (via Services / application layer; gateway only)
```

**Rule**: Engines do not depend on each other except via engine-core interfaces. engine-api depends on engines (through services), not the reverse.

---

## 2. API Dependencies (engine-api)

```
EngineApi (Program.cs)
  ├── Controllers (depend on Services)
  │   ├── EngineController → IEngineService
  │   ├── IntelligenceController → IIntelligenceService
  │   ├── OptimizationController → IOptimizationService
  │   ├── AIController → IAIService
  │   ├── TrustController → ITrustService
  │   └── HealthController
  ├── Services (depend on Repositories where applicable)
  │   ├── EngineService → IEngineRepository
  │   └── others (stateless or external)
  ├── Repositories
  │   └── EngineRepository
  ├── Middleware
  │   └── ApiGatewayMiddleware
  ├── Models
  └── DTOs
```

**Rule**: Controllers → Services → Repositories. No controller → engine directly; gateway-only.

---

## 3. Product-UI Dependencies

```
product-ui (Angular)
  ├── app (shell, routes)
  ├── components (dashboard, engine-monitor, ai-console, graph-viewer, optimization-viewer)
  ├── services (EngineApiService, IntelligenceService, AIService, TrustService, OptimizationService)
  ├── pages (home)
  └── environments

  → HTTP client → engine-api (baseUrl /api)
  → No dependency on engine-core or any engine package at build time
```

**Rule**: Product-UI depends only on engine-api (HTTP). Presentation only.

---

## 4. SaaS-Layer Dependencies

```
saas-layer
  ├── tenancy (tenant_manager)
  ├── auth (auth_service)
  ├── billing (billing_hooks only → delegates to monetization)
  ├── subscriptions (subscription_service; hooks → monetization)
  ├── usage (usage_tracker)
  └── licensing (license_manager)

  → May call engine-api or engines for tenant-scoped operations
  → billing_hooks call monetization (billing_engine, etc.); SaaS does not contain billing logic
```

**Rule**: SaaS wraps engine/API; billing hooks delegate to monetization. No monetization → core intelligence.

---

## 5. Monetization Dependencies

```
monetization
  ├── pricing_engine
  ├── billing_engine
  ├── payment_gateway
  ├── invoice_engine
  └── revenue_tracker

  → No dependency on engine-core, engine-intelligence, or product-ui
  → Called by saas-layer (billing hooks) and/or engine-api for billing events
```

**Rule**: Monetization does not pollute core intelligence; standalone billing/payments/invoicing/revenue.

---

## 6. Platform Dependencies

```
platform
  ├── plugin_engine
  ├── integration_engine
  ├── marketplace_engine
  ├── api_registry
  └── extension_framework

  → May register or invoke engine APIs
  → No engine depends on platform for core logic
```

**Rule**: Platform extends engines/API; engines do not depend on platform.

---

## 7. Enterprise Dependencies

```
enterprise
  ├── compliance (compliance_engine)
  ├── governance (governance_engine)
  ├── sla (sla_manager)
  ├── policies (policy_engine)
  └── security (enterprise_auth)

  → Wraps engines/API for compliance, governance, SLA, policies, security
  → Does not change core engine logic
```

**Rule**: Enterprise layer wraps; no core logic modification.

---

## 8. Infra and Docs

```
infra
  → docker, k8s, terraform, helm, ci-cd
  → Runtime and deployment only; no dependency on business logic

docs
  → research, thesis, papers, system-design, startup, investor, legal
  → No runtime dependency; documentation and investor/startup materials only
```

**Rule**: Infra and docs do not affect runtime dependency graph.

---

## 9. Circular Dependency Check

| From | To | Allowed |
|------|----|--------|
| product-ui | engine-api | ✅ |
| engine-api | engines | ✅ |
| engines | engine-core | ✅ |
| engine-core | (none) | ✅ |
| saas-layer | engine-api / monetization | ✅ |
| monetization | (no engine-core/intelligence) | ✅ |
| platform | engine-api / engines | ✅ |
| enterprise | engine-api / engines | ✅ |
| engines | product-ui | ❌ (none) |
| engines | saas-layer | ❌ (none) |
| engine-core | engines | ❌ (none) |

**Result**: No circular dependencies. Dependency direction is one-way: presentation/SaaS/platform/enterprise → API → engines → core.

---

## 10. References

- **ARCHITECTURE_MAP.md** — High-level map and layer diagram
- **STRUCTURE_VALIDATION.md** — Folder and layer validation
- **CLEANUP_REPORT.md** — Files removed, merged, moved
