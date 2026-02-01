# SaaS API + Tenants UI — Railway Deployment

## Overview

The **saas-api** service exposes tenant management and usage tracking. The **product-ui** Tenants page uses it to list tenants and show usage. Both must be deployed for the Tenants feature to work.

## 1. Deploy saas-api

1. Add a **new service** in your Railway project → GitHub repo (this repo).
2. **Config path:** `deploy/railway/saas-api/railway.toml`
3. **Generate domain:** Settings → Networking → Generate Domain (e.g. `https://saas-api-xxx.up.railway.app`)
4. Deploy. Healthcheck: `/api/saas/health`

## 2. Configure product-ui for Tenants

1. Open **product-ui** service → **Variables**
2. Add variable: `SAAS_API_URL` = your saas-api base URL **including `/api/saas`** (e.g. `https://saas-api-xxx.up.railway.app/api/saas`)
3. **Important:** Use as **build variable** so it’s available during `docker build`. Railway passes Variables to the build; the Dockerfile uses `ARG SAAS_API_URL` and injects it into the Angular env.
4. Redeploy product-ui.

## 3. Verify

1. Visit product-ui → click **Tenants** in the nav.
2. You should see the tenants list (empty at first) or a clear error if saas-api is unreachable.
3. Create a tenant via API: `POST https://your-saas-api.up.railway.app/api/saas/tenants` with body `{"id":"t1","name":"Test","plan":"default"}`.

## Local test (without Railway)

```bash
# Terminal 1: run saas-api
docker run -p 9999:8080 -e PORT=8080 nexus-saas-api-test

# Terminal 2: run product-ui with proxy (dev mode uses /api/saas → localhost:5001)
# Or build product-ui with SAAS_API_URL=http://localhost:9999 for testing
```
