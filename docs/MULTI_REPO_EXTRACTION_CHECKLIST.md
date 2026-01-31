# Multi-Repo Extraction Checklist

Use this checklist when creating a new repository from the monorepo. See [MULTI_REPO_MIGRATION.md](./MULTI_REPO_MIGRATION.md) for the full plan.

---

## Per-Repo Contents (Paths in Monorepo)

Copy these paths into the new repo. Preserve directory names so imports and Dockerfiles can be updated predictably.

### nexus-engine-data

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-data/` | `engine-data/` |
| `services/engine-data-service/` | `services/engine-data-service/` or `service/` |
| `deploy/railway/engine-data/` | `deploy/` (optional) |

**New repo layout option:** Put `engine-data/` and `services/engine-data-service/` at root so Dockerfile can `COPY engine-data/ .` and `COPY services/engine-data-service/ .` with build context = repo root.

**Dependencies:** None from other engines. Optional: copy `engine-contracts/data-evidence/` if the team wants DEC docs in-repo.

---

### nexus-engine-intelligence

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-intelligence/` | `engine-intelligence/` |
| `services/engine-intelligence-service/` | `services/engine-intelligence-service/` or `service/` |
| `deploy/railway/engine-intelligence/` | `deploy/` (optional) |

**Dependencies:** None from other engines. Optional: copy `engine-contracts/data-evidence/` for DEC.

---

### nexus-engine-ai

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-ai/` | `engine-ai/` |
| `services/engine-ai-service/` | `services/engine-ai-service/` or `service/` |
| `deploy/railway/engine-ai/` | `deploy/` (optional) |

---

### nexus-engine-optimization

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-optimization/` | `engine-optimization/` |
| `services/engine-optimization-service/` | `services/engine-optimization-service/` or `service/` |
| `deploy/railway/engine-optimization/` | `deploy/` (optional) |

---

### nexus-engine-trust

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-trust/` | `engine-trust/` |
| `services/engine-trust-service/` | `services/engine-trust-service/` or `service/` |
| `deploy/railway/engine-trust/` | `deploy/` (optional) |

---

### nexus-engine-distributed

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-distributed/` | `engine-distributed/` |
| `services/engine-distributed-service/` | `services/engine-distributed-service/` or `service/` |
| `deploy/railway/engine-distributed/` | `deploy/` (optional) |

---

### nexus-engine-api

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-api/` | (repo root or `engine-api/`) |
| `deploy/railway/engine-api/` | `deploy/` (optional) |

---

### nexus-product-ui

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `product-ui/` | (repo root) |
| `deploy/railway/product-ui/` | `deploy/` (optional) |

**After copy:** Update `src/environments/environment*.ts` (and proxy) to use deployed API URL; no code from other repos.

---

### nexus-contracts

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-contracts/` | `engine-contracts/` or repo root |
| `api-platform/` | `api-platform/` |
| `contracts/` | `contracts/` |

---

### nexus-platform

| Path in monorepo | Copy to new repo |
|------------------|------------------|
| `engine-core/` | `engine-core/` |
| `gateway-layer/` | `gateway-layer/` |
| `orchestration-layer/` | `orchestration-layer/` |
| `deploy/` | `deploy/` (all or only platform-related) |
| `config/` | `config/` |
| `env/` | `env/` |
| `scripts/` | `scripts/` |
| `infra/` | `infra/` |
| `service-mesh/` | `service-mesh/` |
| `docs/` | `docs/` (platform-level) |

---

## Post-Copy Checklist (Per Repo)

- [ ] Dockerfile: update `COPY` paths so they match new repo root (e.g. `COPY engine-data/ ./engine-data/`, `COPY services/engine-data-service/ ./app/` or equivalent).
- [ ] PYTHONPATH / run: ensure domain is on path (e.g. `PYTHONPATH=/app/engine-data:/app` in Dockerfile or run script).
- [ ] Remove or replace references to monorepo paths (e.g. `../../engine-data` → local `engine-data/`).
- [ ] Add README with repo purpose, how to build, run, and deploy.
- [ ] Add CI (e.g. GitHub Actions): test, build image, push to registry.
- [ ] Point Railway/K8s at new repo and image; retest health and flows.
