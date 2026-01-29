# NEXUS-ENGINE — Repository Structure

One-page map of the repo. All code and config stay where they are; this file is the index.

---

## Code & runtime

| Folder | Purpose |
|--------|---------|
| **apps/** | User-facing applications: product-ui (Angular), engine-api (.NET) |
| **engines/** | Core logic: engine-core, engine-ai, engine-data, engine-intelligence, engine-optimization, engine-trust, engine-distributed, saas-layer, engine-*-layer |
| **platform-runtime/** | Runtime & decoupling: service-shells, gateway-layer, orchestration-layer, runtime-decoupling |

---

## Deploy & infra

| Folder | Purpose |
|--------|---------|
| **deploy/** | Docker, Compose, K8s (per-service) |
| **infra/** | Observability, Prometheus, CI/CD placeholders |

---

## Documentation (single place)

| Folder | Purpose |
|--------|---------|
| **docs/** | All documentation. Start at [docs/README.md](docs/README.md). |
| | **docs/onboarding/** — START_HERE, GETTING_STARTED |
| | **docs/guides/** — PROJECT_STRUCTURE, RUN-E2E, DEV_GUIDE, PRODUCT_GUIDE, RESTRUCTURE, E2E-VERIFICATION |
| | **docs/architecture/** — ARCH_OVERVIEW, ARCHITECTURE_MAP, DOMAIN_MODEL, PLATFORM_VISION, PRODUCT_VISION |
| | **docs/reports/** — TEST_RESULTS, CLEANUP_REPORT, DEPENDENCY_GRAPH, etc. |
| | **docs/engineering/**, **docs/system-design/**, **docs/research/**, etc. |

---

## Config & secrets

| Folder | Purpose |
|--------|---------|
| **config/** | Shared config (loaders, schema) |
| **env/** | Environment configs (YAML, JSON) |
| **secrets/** | Secrets flow, vault (no real secrets in repo) |

---

## Specs (single place)

All specification, policy, and governance docs live under **specs/**.

| Folder | Purpose |
|--------|---------|
| **specs/contracts/** | API contracts (YAML) |
| **specs/certification/** | Cert specs (consistency, determinism, performance, etc.) |
| **specs/governance/** | Governance docs (data, lineage) |
| **specs/gates/** | Readiness gates |
| **specs/versioning/** | API/engine versioning, deprecation |
| **specs/security/** | Security docs (engine, identity, trust) |
| **specs/team-boundaries/** | Ownership, escalation, responsibility |
| **specs/products/** | Product definitions (41 .md) |
| **specs/api-platform/** | API governance, contracts, versioning |
| **specs/market-readiness/** | Compliance, enterprise, technical |
| **specs/release/** | Release strategy, pipelines, rollback |
| **specs/ops/** | Runbooks, chaos, DR, incident response |
| **specs/quality/** | Lint, coverage, performance, reliability rules (YAML) |
| **specs/reports/** | Coverage, performance, security, SLA, test reports |

---

## Scripts & data

| Folder | Purpose |
|--------|---------|
| **scripts/** | test-engine-flow, test-api, load-test, chaos-test |
| **benchmarks/** | AI, API, distributed, engine benchmarks (Python) |
| **test-data/** | Mock/synthetic data (JSON) |

---

## Other

| Folder | Purpose |
|--------|---------|
| **platform/** | Plugin/extensions (Python), distributed-standards (.md) |
| **enterprise/** | Compliance engine, SLA manager (Python) |
| **monetization/** | Billing, pricing (Python) |
| **health/** | Dependency check, system check (Python) |
| **engine-productization-layer-copy/** | Copy of engine-productization-layer (legacy) |

---

## Root files

| File | Purpose |
|------|---------|
| **README.md** | Repo entry point, quick start, link to docs |
| **STRUCTURE.md** | This file — one-page map |
| **package.json**, **nx.json**, **angular.json**, **tsconfig.base.json** | Nx/Node/Angular config |
| **run-api.sh**, **run-all.sh**, **run-tests.sh**, **run-ui.sh**, etc. | Run scripts |

---

**Where to go:** [README.md](README.md) → [docs/README.md](docs/README.md) → onboarding or guides.
