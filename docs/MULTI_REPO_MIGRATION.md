# Multi-Repo Migration Plan

This document describes how to split NEXUS-ENGINE into separate Git repositories so that each service and its domain can be owned and developed independently by different teams.

---

## 1. Goals

- **Independent teams:** Each team owns one (or more) repos and can commit, release, and deploy without blocking others.
- **Clear boundaries:** Service + its domain engine live together; shared contracts live in a dedicated repo or package.
- **Deployability:** Each repo produces its own artifact (Docker image); orchestration and gateway reference published images.
- **No breaking production:** Migration can be done incrementally; existing monorepo can remain the source of truth until cutover.

---

## 2. Proposed Repository Layout

| Repository | Contents | Owner | Builds |
|------------|----------|--------|--------|
| **nexus-engine-data** | `engine-data/` + `services/engine-data-service/` | Data team | Python service + domain; Docker image |
| **nexus-engine-intelligence** | `engine-intelligence/` + `services/engine-intelligence-service/` | Intelligence team | Python service + domain; Docker image |
| **nexus-engine-ai** | `engine-ai/` + `services/engine-ai-service/` | AI/ML team | Python service + domain; Docker image |
| **nexus-engine-optimization** | `engine-optimization/` + `services/engine-optimization-service/` | Optimization team | Python service + domain; Docker image |
| **nexus-engine-trust** | `engine-trust/` + `services/engine-trust-service/` | Trust/Security team | Python service + domain; Docker image |
| **nexus-engine-distributed** | `engine-distributed/` + `services/engine-distributed-service/` | Distributed systems team | Python service + domain; Docker image |
| **nexus-engine-api** | `engine-api/` | API/Backend team | .NET API; Docker image |
| **nexus-product-ui** | `product-ui/` | Frontend team | Angular app; Docker image |
| **nexus-contracts** | `engine-contracts/`, `api-platform/`, `contracts/` (OpenAPI/specs) | Platform / API team | Docs + optional npm/pip package of types |
| **nexus-platform** | `engine-core/`, `gateway-layer/`, `orchestration-layer/`, `deploy/`, `config/`, `scripts/` (orchestration), docs, env | Platform / SRE | Gateway, orchestration, deploy configs, shared tooling |

Optional:

- **nexus-saas** — `saas-layer/`, `services/saas-api-service/` if a separate team owns SaaS.
- **nexus-docs** — `docs/`, `certification/`, `products/` as a docs-only repo if desired.

---

## 3. Dependency Graph (Who Depends on What)

```
nexus-product-ui     → nexus-engine-api (HTTP); env URLs only
nexus-engine-api     → engine-core (contracts); calls engine-* services via HTTP (no direct code dep)
nexus-engine-data    → nexus-contracts (DEC, API contracts) optional
nexus-engine-intelligence → nexus-contracts optional
nexus-engine-ai      → (standalone)
nexus-engine-optimization → (standalone)
nexus-engine-trust   → (standalone)
nexus-engine-distributed → (standalone)
nexus-platform       → all service images (deploy, gateway config); nexus-contracts
```

- **No cross-repo code imports** between engine repos. Integration is via HTTP/API only (engine-api or gateway).
- **Contracts:** Types and API specs can live in `nexus-contracts`; each service repo either copies what it needs or depends on a published package (versioned).

---

## 4. What Goes in Each Repo (Checklist)

### 4.1 nexus-engine-data

- `engine-data/` (entire directory: pipelines, indexing, storage, caching, validation, errors, health, models, etc.)
- `services/engine-data-service/` (entire directory)
- `deploy/railway/engine-data/` (optional: copy Railway Dockerfile + railway.toml into repo root or `deploy/`)
- Minimal README, requirements.txt at repo root if you flatten (e.g. `engine-data/` as domain, `app/` as service mirroring current layout)
- **PYTHONPATH / layout:** In new repo, service can reference domain as `engine_data` package or keep `engine-data/` on PYTHONPATH; Dockerfile COPY both.

### 4.2 nexus-engine-intelligence

- `engine-intelligence/` (evaluation, decision, reasoning, inference, validation, etc.)
- `services/engine-intelligence-service/`
- Deploy config for this service (e.g. `deploy/railway/engine-intelligence/`)

### 4.3 nexus-engine-ai

- `engine-ai/` + `services/engine-ai-service/`

### 4.4 nexus-engine-optimization

- `engine-optimization/` + `services/engine-optimization-service/`

### 4.5 nexus-engine-trust

- `engine-trust/` + `services/engine-trust-service/`

### 4.6 nexus-engine-distributed

- `engine-distributed/` + `services/engine-distributed-service/`

### 4.7 nexus-engine-api

- `engine-api/` (entire .NET solution)
- Own deploy configs

### 4.8 nexus-product-ui

- `product-ui/` (Angular app)
- Environment files point to **URLs** of engine-api and services (no code from other repos); proxy config for local dev.

### 4.9 nexus-contracts

- `engine-contracts/` (e.g. Data Evidence Contract)
- `api-platform/` (API governance, versioning, compatibility)
- `contracts/` (OpenAPI/spec YAMLs if any)
- Optionally: publish as npm package `@nexus/contracts` or pip package for shared types.

### 4.10 nexus-platform

- `engine-core/` (shared TypeScript/contracts used by gateway and services)
- `gateway-layer/`, `orchestration-layer/`
- `deploy/` (Railway, K8s, Compose — or reference per-repo images)
- `config/`, `env/`, `scripts/` (test-deployed-services, etc.)
- `docs/` (platform-level), `infra/`, `service-mesh/`
- Monorepo can be archived or kept as read-only after migration.

---

## 5. Extraction Steps (Per Repo)

For each repository (e.g. **nexus-engine-data**):

1. **Create new repo** on Git hosting (e.g. GitHub): `nexus-engine-data`.
2. **Choose root layout:**
   - **Option A (nested):** Keep paths like `engine-data/`, `services/engine-data-service/` so that scripts and docs that reference them still work.
   - **Option B (flat):** Put domain at `engine-data/` and service at `service/` or `app/` at repo root; update imports and Dockerfile COPY.
3. **Copy or filter history:**
   - **Copy (simplest):** Copy only the needed directories into the new repo; initial commit = current state. No history from monorepo.
   - **git filter-repo / subtree:** Extract history for `engine-data/` and `services/engine-data-service/` into the new repo (advanced).
4. **Update paths inside the new repo:**
   - Dockerfile: today many use `COPY services/engine-data-service/` and `COPY engine-data/` from repo root. In the new repo, root is the repo root, so e.g. `COPY engine-data/ ./engine-data/`, `COPY service/ ./service/` (or whatever layout you chose).
   - PYTHONPATH: set so that the service can import the domain (e.g. `PYTHONPATH=/app/engine-data:/app`).
   - Remove or replace references to monorepo-only paths (e.g. `../../engine-data` already handled if domain is in same repo).
5. **CI/CD in new repo:** Add workflow (e.g. GitHub Actions) to run tests, build Docker image, push to registry. Use same Dockerfile and env as today (PORT, etc.).
6. **Deploy:** Point Railway (or K8s) at the new repo; build context = repo root; use the Dockerfile in that repo. Update any platform/orchestrator config to use the new image name/tag if it changes.

Repeat for each of the other repos.

---

## 6. Shared Contracts and Versioning

- **nexus-contracts** should be the single place for API contracts, DEC, and platform governance docs. Version it (e.g. semver or calendar).
- **Consumers:** Each service repo can:
  - **Option A:** Copy the slice of contracts it needs (e.g. DEC) into its repo and update manually when contracts change.
  - **Option B:** Depend on a published package (`@nexus/contracts` or `nexus-contracts`) and bump the dependency when upgrading.
- **Breaking changes:** Follow api-platform/versioning and deprecation; notify consuming teams and bump major when needed.

---

## 7. Deployment and Orchestration After Split

- Each repo builds and pushes its own Docker image (e.g. `registry.example.com/nexus-engine-data:main`).
- **Platform repo** (or existing CI in monorepo) holds:
  - Gateway/config that points to service URLs or image names.
  - Scripts like `test-deployed-services.sh` that hit production/staging URLs (no need for monorepo code).
- **Environment variables:** Each service gets its env (PORT, API URLs, etc.) from Railway/K8s; product-ui gets engine-api URL and any service URLs for direct calls (if any).

---

## 8. Order of Migration (Suggested)

1. **nexus-contracts** — Extract first; no runtime dependency; others can depend on it or copy from it.
2. **nexus-engine-data** — Few dependencies; good pilot.
3. **nexus-engine-intelligence**, **nexus-engine-ai**, **nexus-engine-optimization**, **nexus-engine-trust**, **nexus-engine-distributed** — Same pattern as engine-data.
4. **nexus-engine-api** — .NET; separate build.
5. **nexus-product-ui** — Update env to point to deployed API; no code dependency on other repos.
6. **nexus-platform** — Extract gateway, orchestration, deploy, config, scripts last; or keep in monorepo as “platform” and only remove extracted services.

---

## 9. What Stays in Monorepo (If You Keep It)

- You can keep the monorepo as **read-only** or **archive** after migration.
- Or keep **nexus-platform** as the monorepo with only platform code (engine-core, gateway, deploy, config, docs) and no engine-* or product-ui code.

---

## 10. Summary

| Step | Action |
|------|--------|
| 1 | Create nexus-contracts repo; copy engine-contracts, api-platform, contracts. |
| 2 | For each engine: create repo, copy engine-* + services/engine-*-service, update Dockerfile and PYTHONPATH. |
| 3 | Create nexus-engine-api repo; copy engine-api. |
| 4 | Create nexus-product-ui repo; copy product-ui; set API URLs via env. |
| 5 | Create or retain nexus-platform with gateway, deploy, config, scripts. |
| 6 | Point CI/CD and deploy (Railway, etc.) at new repos; retest end-to-end. |

This gives you separate repos per service and domain so that different teams can work independently while integrating via APIs and shared contracts.

---

## 11. Helper Scripts and Docs

- **Extraction checklist:** [MULTI_REPO_EXTRACTION_CHECKLIST.md](./MULTI_REPO_EXTRACTION_CHECKLIST.md) — per-repo list of paths to copy and post-copy checklist.
- **List repo contents:** From monorepo root, run `./scripts/list-repo-contents.sh <service-name>` (e.g. `engine-data`, `product-ui`, `contracts`, `platform`) to print the paths to copy for that repo.
