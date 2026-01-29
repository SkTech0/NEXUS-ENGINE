# Project Structure — Simple Map

Restructured layout: **apps**, **engines**, **platform-runtime**, **deploy**. Each area is independently runnable.

---

## At a glance

```
NEXUS-ENGINE/
├── 📱 apps/                    User-facing applications
│   ├── product-ui/             Angular UI (dashboards, demos)
│   └── engine-api/             .NET HTTP API (gateway to engines)
│
├── ⚙️ engines/                  Core logic (independently runnable via service-shells)
│   ├── engine-core/             Domain, contracts, interfaces
│   ├── engine-ai/               AI inference, models
│   ├── engine-data/             Data access, storage
│   ├── engine-intelligence/     Intelligence, evaluation
│   ├── engine-optimization/     Optimization, solvers
│   ├── engine-trust/            Trust, verification, audit
│   ├── engine-distributed/      Distributed coordination
│   ├── saas-layer/              Tenancy, auth, billing hooks
│   ├── engine-resilience-layer/ Chaos, circuit-breaker, recovery
│   ├── engine-optimization-layer/
│   ├── engine-validation/
│   ├── engine-certification-layer/
│   ├── engine-explainability/
│   ├── engine-observability/
│   ├── engine-productization-layer/
│   └── engine-optimization-layer/
│
├── 🛡️ platform-runtime/         Runtime & decoupling (wrappers, gateway, orchestration)
│   ├── service-shells/          Wrappers: each engine as its own process
│   ├── gateway-layer/           API gateway (single entrypoint)
│   ├── orchestration-layer/     Registry, discovery, lifecycle order
│   └── runtime-decoupling/      Existing runners & adapters
│
├── 🚀 deploy/                   Deployment (Docker, Compose, K8s)
│   ├── docker/                  Per-service Dockerfiles
│   ├── compose/                 Per-service Compose files
│   └── k8s/                     Per-service K8s manifests
│
├── 📄 config/, env/, secrets/   Config and secrets
├── 📚 docs/                     All documentation (onboarding, guides, architecture, reports)
├── 📋 specs/                    Contracts, certification, governance, gates, products, release, ops, quality, reports, versioning, security, team-boundaries
├── scripts/                     Test, load, chaos scripts
├── infra/                       Observability, Prometheus, etc.
└── package.json, nx.json, angular.json, README.md, docs/ (onboarding, guides, architecture, reports)
```

---

## Where to go for what

| Goal | Where |
|------|--------|
| Run the UI | `nx serve product-ui` (from repo root) |
| Run the API | `./run-api.sh` or `dotnet run --project apps/engine-api/src/EngineApi/EngineApi.csproj` |
| Run one engine as a service | `npx ts-node platform-runtime/service-shells/<name>-service/runner.ts` |
| Deploy with Docker | `deploy/docker/` and `deploy/compose/` |
| Deploy on Kubernetes | `deploy/k8s/` |
| Understand ownership | `team-boundaries/` |
| First-time setup | `docs/onboarding/GETTING_STARTED.md` |

---

## Independently runnable

- **apps/product-ui** — `nx serve product-ui`
- **apps/engine-api** — `./run-api.sh` or service-shell
- **engines/*** — via `platform-runtime/service-shells/<engine>-service/runner.ts` or Docker from `deploy/`
- **deploy/** — each Dockerfile and Compose file builds/runs one service from repo root
