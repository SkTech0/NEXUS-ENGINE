# Using SaaS / Monetization Backend Logic in the Frontend

## Short answer

**There is no dedicated frontend for the SaaS layer, monetization, platform, or enterprise modules yet.** The existing **product-ui** (Angular) is built for:

- Engine APIs (data, intelligence, trust, optimization)
- Demo flows (playground, evaluate, decision, trust, history)
- Loan demo (apply, evaluate, decision, risk, history)
- Dashboard, engine monitor, AI console

The **SaaS / monetization / enterprise** code lives as **Python library modules** (`saas-layer/`, `monetization/`, `platform/`, `enterprise/`). To use them from the frontend you need an **HTTP API in the middle** that calls these modules and exposes REST (or GraphQL) endpoints; the frontend then calls that API.

---

## Architecture: backend logic → API → frontend

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (product-ui, Angular)                                   │
│  - Calls HTTP APIs (e.g. /api/saas/tenants, /api/saas/usage)      │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP (fetch / HttpClient)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  API layer (e.g. saas-api-service, FastAPI)                       │
│  - Wraps Python modules, exposes REST                            │
│  - Uses saas-layer, monetization, etc.                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Python imports
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend logic (Python modules)                                   │
│  - saas-layer: tenant_manager, auth_service, subscription_service,│
│                usage_tracker, license_manager                      │
│  - monetization: pricing_engine, billing_engine, payment_gateway,  │
│                  invoice_engine, revenue_tracker                   │
│  - platform: plugin_engine, integration_engine, marketplace_engine │
│  - enterprise: compliance_engine, governance_engine, sla_manager   │
└─────────────────────────────────────────────────────────────────┘
```

1. **Backend logic** = no HTTP by itself; it’s used by your app or by an API service.
2. **API layer** = one (or more) services that import these modules and expose endpoints.
3. **Frontend** = Angular services that call those endpoints and components that use the services.

---

## What was added for you

To show how to “use this backend logic in the frontend” we added:

| Piece | Location | Purpose |
|-------|----------|--------|
| **SaaS API service** | `services/saas-api-service/` | FastAPI app that uses `saas-layer` and exposes tenants + usage over HTTP. |
| **Angular service** | `product-ui/src/app/services/saas-api.service.ts` | Calls `/api/saas/*` (tenants, usage). |
| **Tenants page** | `product-ui/src/app/pages/tenants/` | Example page at **`/tenants`** that lists tenants and usage via the Angular service. |
| **Proxy** | `product-ui/proxy.conf.json` | Proxies `/api/saas` to the SaaS API service (e.g. port 5001). |

So: **backend logic** is used **inside** `saas-api-service`; the **frontend** uses that logic only **via the API** through the Angular service and the tenants page.

---

## How to run and use it

### 1. Start the SaaS API service

From repo root, with `saas-layer` and repo root on `PYTHONPATH`:

```bash
cd NEXUS-ENGINE
export PYTHONPATH=.:saas-layer
uvicorn services.saas_api_service.app.main:app --host 0.0.0.0 --port 5001
```

Or use the run script under `services/saas-api-service/` if provided.

### 2. Point the frontend at the API

- **Dev:** Proxy is set so that requests to `/api/saas` from the Angular app are sent to the SaaS API service (e.g. `http://localhost:5001`). See `product-ui/proxy.conf.json`.
- **Prod:** Set `saasApiUrl` in `product-ui/src/environments/environment.prod.ts` to your deployed SaaS API base URL.

### 3. Start the frontend

```bash
cd product-ui
npm start
# or: nx serve product-ui
```

Open `/tenants` to see the example page that uses the backend logic (tenants + usage) via the API.

---

## Extending: more backend logic in the frontend

To expose more of the backend to the frontend:

1. **Add endpoints** in `services/saas-api-service/` (or your own API) that:
   - Import and use `auth_service`, `subscription_service`, `usage_tracker`, `license_manager`, or `monetization` / `enterprise` modules.
   - Return JSON (e.g. list of tenants, usage, subscription status, invoices).
2. **Add methods** in `product-ui/src/app/services/saas-api.service.ts` that call those endpoints.
3. **Add routes and components** (e.g. `/account`, `/billing`, `/usage`) that use the service and display the data.

Same pattern everywhere: **backend logic in Python → API wraps it → frontend calls API**.
