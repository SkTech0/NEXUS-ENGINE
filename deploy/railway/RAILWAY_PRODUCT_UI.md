# Deploy Product UI on Railway

This guide covers deploying the **Product UI** (Angular SPA) to [Railway](https://railway.com) as a **separate service** from the Engine API.

---

## What Gets Deployed

- **Service:** Product UI — static Angular app served by nginx
- **Build:** `deploy/railway/product-ui/Dockerfile` (multi-stage: Node build, then nginx)
- **Config:** `deploy/railway/product-ui/railway.toml`
- **Port:** nginx listens on Railway’s `PORT` (default 8080)

The UI is **static** (HTML/JS/CSS). It calls your API using `apiUrl` from `environment.prod.ts` (default `/api`). For Railway you typically point the UI at your Engine API URL.

---

## Prerequisites

1. **Railway account** — [railway.com](https://railway.com)
2. **Repo on GitHub** (or connected Git provider) — NEXUS-ENGINE
3. **Engine API** (or gateway) already deployed and reachable, so the UI can call it

---

## Step 1: Add a New Service in Your Railway Project

1. Open your **Railway project** (the one that has engine-api or your other NEXUS services).
2. Click **+ New** → **GitHub Repo** (or **Empty Service** if you prefer to link later).
3. Select the **NEXUS-ENGINE** repo and the branch to deploy (e.g. `main`).
4. Railway creates a new service. We’ll point this service at the Product UI Dockerfile.

---

## Step 2: Use the Product UI Dockerfile and Config

1. Open the new service → **Settings**.
2. **Root directory:** leave **empty** (repo root). The Dockerfile expects the full repo as build context.
3. **Config-as-code:** set the config file path so Railway uses the Product UI config:
   - **Config File Path:** `deploy/railway/product-ui/railway.toml`

   That file sets:
   - `dockerfilePath = "deploy/railway/product-ui/Dockerfile"`
   - `healthcheckPath = "/"`
   - `healthcheckTimeout = 30`

4. If you don’t use config-as-code, set **Dockerfile path** manually to `deploy/railway/product-ui/Dockerfile` and leave root directory empty.

---

## Step 3: Environment Variables (API URL)

The UI calls the API using `apiUrl` from the **build-time** `environment.prod.ts`. Default is `'/api'` (same origin).

**Option A — UI and API on different Railway services (recommended)**

- Build the UI with your API base URL baked in:
  1. Edit `product-ui/src/environments/environment.prod.ts`.
  2. Set `apiUrl` to your Engine API’s public URL, e.g.  
     `apiUrl: 'https://engine-api-xxxx.up.railway.app'`
  3. Commit and push. Railway will rebuild the UI; it will then call that API URL.
- Ensure your **Engine API** allows CORS from the UI origin (e.g. `https://product-ui-xxxx.up.railway.app`).

**Option B — Same host (UI + API behind one domain)**

- Keep `apiUrl: '/api'` in `environment.prod.ts`.
- Use a **single** Railway service (or a gateway) that serves both the static UI and proxies `/api` to the Engine API. That requires a custom Dockerfile or gateway config (e.g. nginx proxying `/api` to the API). For a quick split setup, Option A is simpler.

---

## Step 4: Deploy and Get a URL

1. **Trigger a deploy:** push to the connected branch, or click **Deploy** in the Railway dashboard.
2. **Build:** Railway runs `deploy/railway/product-ui/Dockerfile` from repo root. It installs deps, runs `ng build product-ui --configuration=production`, then copies the output into an nginx image that listens on `$PORT`.
3. **Generate domain:** In the service go to **Settings → Networking → Public Networking** → **Generate Domain**. You’ll get a URL like `https://product-ui-production.up.railway.app`.
4. **Healthcheck:** Railway calls `healthcheckPath = "/"`. If the app responds with 200, the deployment is healthy.

---

## Step 5: Verify

1. Open the generated URL in a browser. You should see the NEXUS Playground (landing, nav, etc.).
2. If you set `apiUrl` to your Engine API URL (Option A), use **Playground** or **Loan** flows; they should call the API. If you see network errors, check CORS on the API and that `apiUrl` is correct in `environment.prod.ts` and you’ve redeployed the UI.

---

## Summary Checklist

- [ ] New Railway service created from NEXUS-ENGINE repo.
- [ ] **Config File Path** = `deploy/railway/product-ui/railway.toml` (or Dockerfile path = `deploy/railway/product-ui/Dockerfile`).
- [ ] **Root directory** left empty (repo root).
- [ ] `environment.prod.ts` `apiUrl` set to your Engine API URL (if UI and API are on different services).
- [ ] Engine API allows CORS from the UI domain.
- [ ] Public domain generated; opening it shows the UI; API calls work.

---

## Files Reference

| File | Purpose |
|------|---------|
| `deploy/railway/product-ui/Dockerfile` | Multi-stage build: Node builds Angular, nginx serves on `$PORT`. |
| `deploy/railway/product-ui/railway.toml` | Railway config: Dockerfile path, healthcheck `/`, timeout. |
| `deploy/railway/product-ui/nginx.railway.conf` | Nginx template; port 8080 is replaced with `$PORT` at container start. |
| `product-ui/src/environments/environment.prod.ts` | Build-time `apiUrl`; set to your API URL for cross-origin calls. |

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Build fails: “Cannot find module” or “Project file does not exist” | Root directory must be **empty** (repo root). Dockerfile expects full repo (package.json, angular.json, product-ui/, engine-*, etc.). |
| Build fails: out of memory | Railway’s default memory may be tight. In **Settings → Resources** increase memory if needed, or ensure `NODE_OPTIONS=--max-old-space-size=4096` is used (it is in the Dockerfile). |
| 502 / “Application not responding” | The container must listen on `$PORT`. The Dockerfile CMD replaces 8080 with `$PORT` in the nginx config; don’t override `PORT` unless you know what you’re doing. |
| UI loads but API calls fail (CORS or 404) | Set `apiUrl` in `environment.prod.ts` to the full Engine API URL, enable CORS on the API for the UI origin, then redeploy the UI. |
| Health check fails | Healthcheck path is `/`. Ensure nginx is serving `index.html` for `/` (the Dockerfile does this). |

Once this is set up, each push to the connected branch will build and deploy the Product UI on Railway.
