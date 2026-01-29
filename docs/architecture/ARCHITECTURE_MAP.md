# Nexus Engine — Architecture Map

Post-audit architecture: engine relationships, data flow, dependency graph, layer diagram.

---

## 1. Engine Relationships

```
                    ┌─────────────────┐
                    │  engine-core    │  (domain, interfaces, contracts, kernel)
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│engine-distributed│  │  engine-data    │  │engine-intelligence│
│ consensus       │  │  models         │  │ reasoning       │
│ replication     │  │  schemas        │  │ inference       │
│ coordination    │  │  storage        │  │ decision        │
│ state           │  │  pipelines      │  │ planning        │
│ clocks          │  │  indexing       │  │ learning        │
│ messaging       │  │  caching        │  │ evaluation      │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ engine-optimization│  │  engine-ai     │  │  engine-trust  │
│ heuristics     │  │  models         │  │  identity      │
│ solvers        │  │  training       │  │  reputation    │
│ schedulers     │  │  inference      │  │  verification  │
│ allocators     │  │  pipelines      │  │  security      │
│ predictors     │  │  features      │  │  compliance    │
└────────────────┘  │  registry       │  │  audit         │
                    └────────┬────────┘  └────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  engine-api     │  (gateway-only: Controllers, Services, DTOs, Middleware, Repositories)
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  product-ui    │  │  saas-layer    │  │  monetization  │
│  presentation  │  │  tenancy       │  │  pricing       │
│  only          │  │  auth          │  │  billing       │
│                │  │  billing hooks │  │  payments      │
│                │  │  subscriptions │  │  invoicing     │
│                │  │  usage         │  │  revenue       │
│                │  │  licensing    │  │                │
└────────────────┘  └────────┬────────┘  └────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  platform      │  │  enterprise    │  │  infra         │
│  plugins       │  │  compliance    │  │  docker        │
│  integrations  │  │  governance    │  │  k8s           │
│  extensions    │  │  sla           │  │  terraform     │
│  marketplace   │  │  policies      │  │  helm          │
│  registry      │  │  security      │  │  ci-cd         │
└────────────────┘  └────────────────┘  └────────────────┘
```

---

## 2. Data Flow Direction

- **Inbound (to engines)**: product-ui → engine-api → engines. SaaS-layer and platform call engines via API or interfaces.
- **Outbound (from engines)**: Engines expose interfaces/contracts; engine-api and product-ui consume. No engine depends on product-ui or SaaS business logic.
- **Monetization**: SaaS billing hooks call monetization (billing, invoicing); monetization does not call core intelligence.
- **Enterprise**: Enterprise layer (compliance, governance, SLA, policies, security) wraps engines; does not inject into core logic.
- **Docs / research / investor**: No runtime dependency; documentation and startup/investor materials only.

---

## 3. Layer Diagram

| Layer | Contents | Depends on |
|-------|----------|------------|
| **Core** | engine-core (domain, interfaces, contracts, kernel) | Nothing |
| **Engines** | engine-distributed, engine-data, engine-intelligence, engine-optimization, engine-ai, engine-trust | engine-core (interfaces/contracts) |
| **Gateway** | engine-api | Engines (via services) |
| **Presentation** | product-ui | engine-api (HTTP) |
| **SaaS** | saas-layer (tenancy, auth, billing hooks, subscriptions, usage, licensing) | Engines / API; billing hooks → monetization |
| **Monetization** | monetization (pricing, billing, payments, invoicing, revenue) | No core engine logic |
| **Platform** | platform (plugins, integrations, extensions, marketplace, registry) | Engines / API |
| **Enterprise** | enterprise (compliance, governance, sla, policies, security) | Engines / API; no core logic change |
| **Infra** | infra (docker, k8s, terraform, helm, ci-cd) | Runtime only |
| **Docs** | docs (research, thesis, papers, system-design, startup, investor, legal) | No runtime |

---

## 4. Canonical Folder Mapping (Target)

| Target path | Status |
|-------------|--------|
| /engine-core/domain | ✅ Present |
| /engine-core/interfaces | ✅ Added (replaces ports) |
| /engine-core/contracts | ✅ Added |
| /engine-core/kernel | ✅ Added |
| /engine-distributed/{consensus,replication,coordination,state,clocks,messaging} | ✅ Present |
| /engine-data/{models,schemas,storage,pipelines,indexing,caching} | ✅ Present |
| /engine-intelligence/{reasoning,inference,decision,planning,learning,evaluation} | ✅ Present |
| /engine-optimization/{heuristics,solvers,schedulers,allocators,predictors} | ✅ Present |
| /engine-ai/{models,training,inference,pipelines,features,registry} | ✅ Present (duplicate engine_ai/ removed) |
| /engine-trust/{identity,reputation,verification,security,compliance,audit} | ✅ Present |
| /engine-api/{Controllers,Services,Models,DTOs,Middleware,Repositories} | ✅ Present |
| /saas-layer/{tenancy,auth,billing,subscriptions,usage,licensing} | ✅ tenancy, subscriptions, licensing, billing added; legacy tenants/subscription/license retained for backward compat |
| /monetization/{pricing,billing,payments,invoicing,revenue} | ⚠️ Flat files retained; subfolders optional next step |
| /platform/{plugins,integrations,extensions,marketplace,registry} | ⚠️ Flat files retained; subfolders optional next step |
| /enterprise/{compliance,governance,sla,policies,security} | ✅ compliance/ added with canonical module; rest flat (governance, sla, policies, security) |
| /infra/{docker,k8s,terraform,helm,ci-cd} | ✅ All present |
| /docs/{research,thesis,papers,system-design,startup,investor,legal} | ✅ system-design, legal added |

---

## 5. References

- **STRUCTURE_VALIDATION.md** — Folder and layer validation
- **CLEANUP_REPORT.md** — Files removed, merged, moved
- **DEPENDENCY_GRAPH.md** — Engine and API dependencies
