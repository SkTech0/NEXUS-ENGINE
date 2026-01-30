# Deploy NEXUS-ENGINE on Railway

This guide walks you through deploying the **Engine API** (ASP.NET Core) to [Railway](https://railway.com) using the repo’s Dockerfile and config.

---

## What Gets Deployed

- **Service:** Engine API (`engine-api`) — ASP.NET Core 10 web API
- **Build:** Root `Dockerfile` (multi-stage .NET 10 build)
- **Config:** Root `railway.toml` (Dockerfile builder, healthcheck, restart policy)
- **Port:** App listens on Railway’s `PORT` (default 8080)

The API runs in **standalone mode**: all engine logic (AI, Intelligence, Optimization, Trust) is in-process. To use **remote engine services** later, set `Engines:BaseUrl` in Railway variables.

---

## Prerequisites

1. **Railway account** — [railway.com](https://railway.com) (GitHub login supported)
2. **Git** — Repo pushed to GitHub (or another connected Git provider)
3. **Optional:** [Railway CLI](https://docs.railway.com/guides/cli) for local linking and env

---

## Step 1: Create a New Project on Railway

1. Go to [railway.com](https://railway.com) and log in.
2. Click **New Project**.
3. Choose **Deploy from GitHub repo** (or GitLab/Bitbucket if you use that).
4. Select the **NEXUS-ENGINE** repository and the branch you want to deploy (e.g. `main`).

Railway will create a project and one service from this repo.

---

## Step 2: Configure the Service (Dockerfile)

Railway will detect the **root `Dockerfile`** and use it automatically. No extra build config is required if you use the repo as-is.

- **Builder:** Set to **Dockerfile** (already in `railway.toml` as `builder = "dockerfile"`).
- **Dockerfile path:** `Dockerfile` at repo root (default; also in `railway.toml` as `dockerfilePath = "Dockerfile"`).
- **Root directory:** Leave as repo root so `COPY . .` in the Dockerfile sees `engine-api/`.

If your Dockerfile were in a subfolder (e.g. `deploy/railway/Dockerfile`), you would set in **Service → Variables**:

```bash
RAILWAY_DOCKERFILE_PATH=deploy/railway/Dockerfile
```

Or in `railway.toml`:

```toml
[build]
dockerfilePath = "deploy/railway/Dockerfile"
```

For this repo, the root `Dockerfile` is correct; no change needed.

---

## Step 3: Environment Variables (Optional)

In **Project → Your Service → Variables**, add any variables your app needs.

| Variable | Required | Description |
|----------|----------|-------------|
| `ASPNETCORE_ENVIRONMENT` | No | Set to `Production` for production (optional; Railway often sets this). |
| `Engines__BaseUrl` | No | If you later add separate engine services, set their base URL (e.g. `https://engines.example.com`). Leave empty for in-process engines. |
| `EngineApi__BaseUrl` | No | Public URL of this API (e.g. `https://your-app.up.railway.app`) if the app needs to reference itself. |
| `Loan__PlatformBaseUrl` | No | Used by the Loan domain; can match `EngineApi__BaseUrl` or `Engines__BaseUrl`. |

Note: In ASP.NET Core, `__` (double underscore) in env vars maps to `:` in config (e.g. `Engines__BaseUrl` → `Engines:BaseUrl`).

You can deploy with **no variables**; the API will run with in-process engines and defaults.

---

## Step 4: Deploy

1. After connecting the repo, Railway runs a **build** using the Dockerfile:
   - Restores and publishes `engine-api/src/EngineApi/EngineApi.csproj`.
   - Produces a runtime image that listens on `$PORT`.
2. After a successful build, Railway **deploys** the container and assigns a public URL (e.g. `https://<service>.up.railway.app`).
3. In the **Deployments** tab you’ll see build logs; you should see something like:
   ```text
   ========================== Using detected Dockerfile! ==========================
   ```

If the build fails, check the logs for .NET restore/publish errors and that the repo root contains the `engine-api/` folder.

---

## Step 5: Public URL and Health

1. **Generate a domain:** In your service, open **Settings → Networking → Public Networking**, and click **Generate Domain**. You’ll get a URL like `https://nexus-engine-production.up.railway.app`.
2. **Healthcheck:** The repo’s `railway.toml` sets:
   - `healthcheckPath = "/api/Health/live"`
   - `healthcheckTimeout = 60`
   Railway will call this path to consider the deployment healthy.
3. **Verify:** Open in a browser or with curl:
   - **Liveness:** `https://<your-domain>/api/Health/live`
   - **Readiness:** `https://<your-domain>/api/Health/ready`
   - **Swagger:** `https://<your-domain>/swagger`

---

## Step 6: Using a Custom Dockerfile Path

If you want to use the Dockerfile in `deploy/railway/` instead of the root:

1. **Option A – Variable**  
   In Railway **Service → Variables** add:
   ```bash
   RAILWAY_DOCKERFILE_PATH=deploy/railway/Dockerfile
   ```
2. **Option B – Config as code**  
   In the **repo root** `railway.toml`, set:
   ```toml
   [build]
   builder = "dockerfile"
   dockerfilePath = "deploy/railway/Dockerfile"
   ```

In both cases, the **build context** remains the repo root (so `COPY . .` in the Dockerfile still works). The `deploy/railway/Dockerfile` in this repo is kept in sync with the root Dockerfile.

---

## Step 7: Redeploys and Branch-Based Deploys

- **Redeploy:** Push to the connected branch or click **Redeploy** in the Railway dashboard.
- **Watch paths (optional):** To deploy only when certain paths change, use [watch patterns](https://docs.railway.com/guides/build-configuration#configure-watch-paths) in `railway.toml`, e.g.:
  ```toml
  [build]
  watchPatterns = ["engine-api/**", "Dockerfile", "railway.toml"]
  ```
- **PR previews:** In **Project Settings**, you can enable **Deploy on PR** so each pull request gets its own ephemeral URL.

---

## Summary Checklist

- [ ] Railway account created; repo connected (e.g. GitHub).
- [ ] Project created from NEXUS-ENGINE repo; one service created.
- [ ] Build uses root **Dockerfile** (and `railway.toml` if present).
- [ ] No env vars required for first run; add `Engines__BaseUrl` etc. if you add remote engines.
- [ ] Public domain generated; health at `/api/Health/live` returns 200.
- [ ] Swagger and `/api/Health/ready` tested on your generated URL.

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Build fails on `dotnet restore` | Ensure path in Dockerfile matches your repo layout (`engine-api/src/EngineApi/EngineApi.csproj`). |
| Build fails: “Dockerfile not found” | Confirm `dockerfilePath` in `railway.toml` or `RAILWAY_DOCKERFILE_PATH` points to the correct file; root is `Dockerfile`. |
| 502 / “Application not responding” | App must listen on `0.0.0.0:$PORT`. The repo Dockerfile uses `ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}`; don’t override `PORT` unless you know what you’re doing. |
| Health check fails | Ensure `healthcheckPath` is `/api/Health/live` and the service has a generated public domain so Railway can reach it. |
| Need logs | Use **Service → Deployments → [latest] → View Logs** in the Railway dashboard. |

---

## Files Reference

| File | Purpose |
|------|---------|
| `/Dockerfile` | Multi-stage build for Engine API; used by Railway from repo root. |
| `/railway.toml` | Config-as-code: Dockerfile builder, health path, timeout, restart policy. |
| `/deploy/railway/Dockerfile` | Copy of root Dockerfile for reference; use if you prefer `RAILWAY_DOCKERFILE_PATH=deploy/railway/Dockerfile`. |
| `/deploy/railway/RAILWAY_DEPLOY_GUIDE.md` | This guide. |

Once these are in place, every push to the connected branch can trigger a new build and deploy on Railway.
