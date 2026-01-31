# Railway Deployment — Multi-Repo Setup

Now that each service lives in its own GitHub repo (e.g. [nexus-engine-data](https://github.com/SkTech0/nexus-engine-data)), deployment on Railway works **one repo per Railway service**. Each service connects to its own repo; build context is that repo’s root.

---

## How It Works Now

| Before (monorepo) | Now (multi-repo) |
|-------------------|------------------|
| One GitHub repo (NEXUS-ENGINE) | One GitHub repo **per service** (e.g. nexus-engine-data) |
| Multiple Railway services, all from same repo | One Railway service **per repo** |
| Each service used **config path** (e.g. `deploy/railway/engine-data/railway.toml`) and **Dockerfile path** (e.g. `deploy/railway/engine-data/Dockerfile`) | **Dockerfile at repo root**; build context = repo root |
| Root directory = repo root | Root directory = repo root (that repo only) |

Each new repo already has a **root `Dockerfile`** that builds domain + service and uses `$PORT`. Railway will pick it up automatically if the root `railway.toml` (or Railway UI) points to it.

---

## Step 1: One Railway Project, One Service per Repo

1. Go to [railway.com](https://railway.com) and open your project (or create a **New Project**).
2. For each service you want to run:
   - **Add Service** → **GitHub Repo**.
   - Select the **repo** (e.g. `SkTech0/nexus-engine-data`, `SkTech0/nexus-engine-intelligence`, …).
   - Branch: **main** (or your default branch).

You will have one Railway service per GitHub repo.

---

## Step 2: Build Settings (Per Service)

Each repo has a **Dockerfile at the root**. Railway will detect it.

- **Builder:** Dockerfile (default).
- **Dockerfile path:** `Dockerfile` (repo root). Do **not** set a subpath like `deploy/railway/engine-data/Dockerfile` — the root Dockerfile includes domain + service.
- **Root directory:** Leave **empty** (build context = repo root).

If you use **Config-as-code**, add a **root** `railway.toml` in each repo with content like below (healthcheck path per service).

---

## Step 3: Root `railway.toml` (Optional but Recommended)

Add a `railway.toml` at the **root** of each repo so healthcheck and restart policy are set.

**Engine services (Python)** — e.g. nexus-engine-data, nexus-engine-intelligence, nexus-engine-ai, nexus-engine-optimization, nexus-engine-trust, nexus-engine-distributed:

```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
healthcheckPath = "/api/Data/health"   # change per service: /api/Intelligence/health, /api/AI/health, etc.
healthcheckTimeout = 60
restartPolicyType = "ON_FAILURE"
```

**Healthcheck path per service:**

| Repo | healthcheckPath |
|------|-----------------|
| nexus-engine-data | `/api/Data/health` |
| nexus-engine-intelligence | `/api/Intelligence/health` |
| nexus-engine-ai | `/api/AI/health` |
| nexus-engine-optimization | `/api/Optimization/health` |
| nexus-engine-trust | `/api/Trust/health` |
| nexus-engine-distributed | `/api/Distributed/health` |

**nexus-engine-api:**

```toml
[build]
builder = "dockerfile"
dockerfilePath = "deploy/railway/engine-api/Dockerfile"

[deploy]
healthcheckPath = "/api/Health/live"
healthcheckTimeout = 60
restartPolicyType = "ON_FAILURE"
```

**nexus-product-ui:**

```toml
[build]
builder = "dockerfile"
dockerfilePath = "deploy/railway/product-ui/Dockerfile"

[deploy]
healthcheckPath = "/"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
```

Commit and push `railway.toml` to each repo; Railway will use it if **Settings → Config-as-code** is set to that file (or leave default and set healthcheck in the UI).

---

## Step 4: Generate Public Domain (Per Service)

For each Railway service:

1. Open the service → **Settings** → **Networking** → **Public Networking**.
2. Click **Generate Domain**.
3. Note the URL (e.g. `https://nexus-engine-data-production.up.railway.app`).

You need one public URL per service so engine-api and product-ui can call them.

---

## Step 5: Environment Variables

### Engine API (gateway)

Point the gateway at each engine’s Railway URL. In **nexus-engine-api** service → **Variables**, set:

| Variable | Example value |
|----------|----------------|
| `ENGINES_AI_BASE_URL` | `https://nexus-engine-ai-xxx.up.railway.app` |
| `ENGINES_INTELLIGENCE_BASE_URL` | `https://nexus-engine-intelligence-xxx.up.railway.app` |
| `ENGINES_TRUST_BASE_URL` | `https://nexus-engine-trust-xxx.up.railway.app` |
| `ENGINES_DATA_BASE_URL` | `https://nexus-engine-data-xxx.up.railway.app` |
| `ENGINES_OPTIMIZATION_BASE_URL` | `https://nexus-engine-optimization-xxx.up.railway.app` |
| `ENGINES_DISTRIBUTED_BASE_URL` | `https://nexus-engine-distributed-xxx.up.railway.app` |

Use the **exact** URLs you generated in Step 4 (no trailing slash). The API uses these to proxy requests to each engine.

### Product UI

In **nexus-product-ui** service → **Variables**, set the public URL of engine-api so the UI can call the API:

| Variable | Example value |
|----------|----------------|
| (depends on your Angular env) | e.g. build-time env or runtime config pointing to `https://nexus-engine-api-xxx.up.railway.app` |

How you inject this (e.g. `environment.prod.ts`, Railway build env, or runtime config) depends on your product-ui setup; the value should be the engine-api public URL.

### Engine services (data, intelligence, ai, etc.)

No extra env vars are required for a basic run. Each app listens on `$PORT` (Railway sets this). Add any service-specific vars (e.g. log level) as needed.

---

## Step 6: Deploy and Verify

1. **Deploy:** Push to `main` (or trigger a deploy from the Railway dashboard). Each repo builds from its root Dockerfile and deploys.
2. **Health:** After deploy, Railway calls the service’s `healthcheckPath`. If it returns 200, the deployment is healthy.
3. **Smoke test:** From the monorepo you can run:
   ```bash
   export ENGINE_API_URL="https://your-engine-api.up.railway.app"
   export ENGINES_DATA_URL="https://your-engine-data.up.railway.app"
   # ... set all engine URLs
   ./scripts/test-deployed-services.sh
   ```

---

## Summary

| What | Where |
|------|--------|
| **One service per repo** | Each Railway service is linked to one GitHub repo (nexus-engine-data, nexus-engine-intelligence, …). |
| **Build** | Railway uses the **root Dockerfile** in that repo; build context = repo root. |
| **Health** | Set `healthcheckPath` in a root `railway.toml` or in Railway UI (see table above). |
| **Port** | Each app listens on `$PORT`; no change needed. |
| **Gateway** | In **engine-api** only, set all `ENGINES_*_BASE_URL` to the other services’ public URLs. |
| **UI** | In **product-ui**, point the API base URL to your deployed engine-api URL. |

**nexus-contracts** and **nexus-platform** do not run as apps on Railway; they are used for docs, config, and tooling. Deploy only the **engine** repos, **engine-api**, and **product-ui** as Railway services.

Once this is set up, every push to a repo’s main branch can trigger a new build and deploy for that service only; teams can release independently.

---

## Quick Reference

| Railway service | GitHub repo | Root Dockerfile | Health path |
|-----------------|-------------|-----------------|-------------|
| engine-data | SkTech0/nexus-engine-data | Yes | `/api/Data/health` |
| engine-intelligence | SkTech0/nexus-engine-intelligence | Yes | `/api/Intelligence/health` |
| engine-ai | SkTech0/nexus-engine-ai | Yes | `/api/AI/health` |
| engine-optimization | SkTech0/nexus-engine-optimization | Yes | `/api/Optimization/health` |
| engine-trust | SkTech0/nexus-engine-trust | Yes | `/api/Trust/health` |
| engine-distributed | SkTech0/nexus-engine-distributed | Yes | `/api/Distributed/health` |
| engine-api | SkTech0/nexus-engine-api | Use `deploy/railway/engine-api/Dockerfile` | `/api/Health/live` |
| product-ui | SkTech0/nexus-product-ui | Use `deploy/railway/product-ui/Dockerfile` | `/` |
