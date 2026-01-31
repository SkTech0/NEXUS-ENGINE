# Multi-Service Railway Deployment

NEXUS-ENGINE can run on Railway as a **multi-service platform**: one gateway (engine-api) and six engine services, each deployed as its own Railway service.

> **Using split repos (nexus-engine-data, nexus-engine-intelligence, etc.)?** See **[docs/RAILWAY_DEPLOY_MULTI_REPO.md](../../docs/RAILWAY_DEPLOY_MULTI_REPO.md)** for deployment with one repo per service.

## Topology

| Railway Service     | Stack    | Dockerfile                          | Role                    |
|---------------------|----------|-------------------------------------|-------------------------|
| engine-api          | .NET 10  | `deploy/railway/engine-api/Dockerfile` | Gateway / orchestrator  |
| engine-ai           | Python 3.11 | `deploy/railway/engine-ai/Dockerfile` | AI inference            |
| engine-intelligence | Python 3.11 | `deploy/railway/engine-intelligence/Dockerfile` | Intelligence / Engine execute |
| engine-trust        | Python 3.11 | `deploy/railway/engine-trust/Dockerfile` | Trust verify/score      |
| engine-data         | Python 3.11 | `deploy/railway/engine-data/Dockerfile` | Data query/index        |
| engine-optimization | Python 3.11 | `deploy/railway/engine-optimization/Dockerfile` | Optimization            |
| engine-distributed  | Python 3.11 | `deploy/railway/engine-distributed/Dockerfile` | Distributed coordination |
| **product-ui**      | Angular + nginx | `deploy/railway/product-ui/Dockerfile` | Static SPA (Playground, Loan, Trust, etc.) |

## Request Flow

- **Client** → **engine-api** (gateway) only. No direct client → engine access.
- **engine-api** routes to each engine over HTTP using per-engine BaseUrl.

## Deploying Each Service on Railway

1. Create **one Railway project** and **eight services** (or reuse one project with multiple services).
2. For each service:
   - **Deploy from same repo** (this repo).
   - **Root directory**: **leave empty** (repo root). Do NOT set a root directory — the Dockerfile expects the full repo as build context (e.g. `engine-api/` must exist).
   - **Config File Path** (Settings → Config-as-code): set to use the correct `railway.toml` per service:
     - engine-api: `deploy/railway/engine-api/railway.toml`
     - engine-ai: `deploy/railway/engine-ai/railway.toml`
     - engine-intelligence: `deploy/railway/engine-intelligence/railway.toml`
     - engine-trust: `deploy/railway/engine-trust/railway.toml`
     - engine-data: `deploy/railway/engine-data/railway.toml`
     - engine-optimization: `deploy/railway/engine-optimization/railway.toml`
     - engine-distributed: `deploy/railway/engine-distributed/railway.toml`
     - product-ui: `deploy/railway/product-ui/railway.toml`
     Each file sets the correct Dockerfile path and **healthcheck path** for that service.
   - **Dockerfile path** (if not using config file): set per service:
     - engine-api: `deploy/railway/engine-api/Dockerfile`
     - engine-ai: `deploy/railway/engine-ai/Dockerfile`
     - engine-intelligence: `deploy/railway/engine-intelligence/Dockerfile`
     - engine-trust: `deploy/railway/engine-trust/Dockerfile`
     - engine-data: `deploy/railway/engine-data/Dockerfile`
     - engine-optimization: `deploy/railway/engine-optimization/Dockerfile`
     - engine-distributed: `deploy/railway/engine-distributed/Dockerfile`
     - product-ui: `deploy/railway/product-ui/Dockerfile`
3. **Generate a public domain** for each service (Settings → Networking → Generate Domain).
4. **engine-api only**: set these variables (use the generated URLs from step 3):

   | Variable                    | Example value                          |
   |----------------------------|----------------------------------------|
   | `ENGINES_AI_BASE_URL`      | `https://engine-ai-xxx.up.railway.app` |
   | `ENGINES_INTELLIGENCE_BASE_URL` | `https://engine-intelligence-xxx.up.railway.app` |
   | `ENGINES_TRUST_BASE_URL`   | `https://engine-trust-xxx.up.railway.app` |
   | `ENGINES_DATA_BASE_URL`    | `https://engine-data-xxx.up.railway.app` |
   | `ENGINES_OPTIMIZATION_BASE_URL` | `https://engine-optimization-xxx.up.railway.app` |
   | `ENGINES_DISTRIBUTED_BASE_URL` | `https://engine-distributed-xxx.up.railway.app` |

   All six must be set for **platform mode** (gateway-only; no in-process engines).

## Health

| Service | Config File | Healthcheck Path |
|---------|-------------|------------------|
| engine-api | `deploy/railway/engine-api/railway.toml` | `/api/Health/live` |
| engine-ai | `deploy/railway/engine-ai/railway.toml` | `/api/AI/health` |
| engine-intelligence | `deploy/railway/engine-intelligence/railway.toml` | `/api/Intelligence/health` |
| engine-trust | `deploy/railway/engine-trust/railway.toml` | `/api/Trust/health` |
| engine-data | `deploy/railway/engine-data/railway.toml` | `/api/Data/health` |
| engine-optimization | `deploy/railway/engine-optimization/railway.toml` | `/api/Optimization/health` |
| engine-distributed | `deploy/railway/engine-distributed/railway.toml` | `/api/Distributed/health` |
| product-ui | `deploy/railway/product-ui/railway.toml` | `/` |

**Config File Path:** For each service, go to **Settings → Config-as-code → Add File Path** and set the path above (e.g. `deploy/railway/engine-data/railway.toml` for engine-data). Each file defines the correct Dockerfile and healthcheck path, so deployments will pass.

## Build Context

All Dockerfiles assume **build context = repo root**. **Root directory must be empty** — if set to a subdirectory, the build fails with "Project file does not exist". In Railway, do not set a “Root directory” that changes context; only set the **Dockerfile path** so the Dockerfile location is correct; the context remains the repo root.
