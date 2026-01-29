# Project Structure — Simple Map

This doc groups the repo so it’s easy to navigate. **Folders are not moved**; paths stay the same for Nx, Docker, and scripts.

---

## At a glance

```
NEXUS-ENGINE/
├── 📱 APPS (user-facing)
│   ├── product-ui/          Angular UI (dashboards, demos)
│   └── engine-api/          .NET HTTP API (gateway to engines)
│
├── ⚙️ ENGINES (core logic — do not move)
│   ├── engine-core/         Domain, contracts, interfaces
│   ├── engine-ai/           AI inference, models
│   ├── engine-data/         Data access, storage
│   ├── engine-intelligence/ Intelligence, evaluation
│   ├── engine-optimization/ Optimization, solvers
│   ├── engine-trust/        Trust, verification, audit
│   └── engine-distributed/  Distributed coordination
│
├── 🛡️ PLATFORM (runtime & decoupling)
│   ├── service-shells/      Wrappers: each engine as its own process
│   ├── gateway-layer/       API gateway (single entrypoint)
│   ├── orchestration-layer/ Registry, discovery, lifecycle order
│   └── runtime-decoupling/  Existing runners & adapters
│
├── 🚀 DEPLOY
│   ├── deployment-shells/   Docker, Compose, K8s (per service)
│   └── infra/               Observability, Prometheus, etc.
│
├── 👥 GOVERNANCE & TEAMS
│   └── team-boundaries/     Ownership, escalation, responsibility
│
├── 📄 CONFIG & SECRETS
│   ├── config/              Shared config
│   ├── env/                 Environment configs
│   └── secrets/             Secrets flow, vault (no real secrets in repo)
│
├── 📚 DOCS & SPECS
│   ├── docs/                Engineering docs
│   ├── products/            Product definitions
│   ├── contracts/           API contracts
│   ├── certification/       Cert specs
│   ├── governance/          Governance docs
│   └── gates/               Readiness gates
│
└── 🔧 SCRIPTS & ROOT
    ├── scripts/             Test, load, chaos scripts
    ├── package.json         Nx monorepo root
    ├── nx.json
    ├── START_HERE.md        First read
    ├── PROJECT_STRUCTURE.md This file
    └── GETTING_STARTED.md   Git → Production
```

---

## Where to go for what

| Goal | Where |
|------|--------|
| Run the UI | `product-ui/` → `nx serve product-ui` |
| Run the API | `engine-api/` → `dotnet run` or `service-shells/engine-api-service/` |
| Run one engine as a service | `service-shells/<name>-service/runner.ts` |
| Deploy with Docker | `deployment-shells/docker/` and `deployment-shells/compose/` |
| Deploy on Kubernetes | `deployment-shells/k8s/` |
| Understand ownership | `team-boundaries/` |
| First-time setup | `GETTING_STARTED.md` |

---

## Why not move folders?

Nx, Dockerfiles, Compose, and K8s all use these paths. Moving folders would break:

- `nx.json` / `project.json` and build outputs  
- Docker `COPY` and `context`  
- Compose `context: ../..`  
- Imports and `tsconfig` paths  

So we keep the layout and use this map to make it **look** simple without changing paths.
