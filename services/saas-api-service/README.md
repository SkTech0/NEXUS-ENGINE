# SaaS API Service

HTTP API over **saas-layer** (tenants, usage). Used by the frontend (product-ui) to use backend SaaS logic.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/saas/tenants | List active tenants |
| POST | /api/saas/tenants | Create tenant (body: `id`, `name`, `plan`) |
| GET | /api/saas/tenants/{id} | Get tenant by id |
| GET | /api/saas/tenants/{id}/usage | Get usage summary for tenant |
| POST | /api/saas/tenants/{id}/usage | Record usage (body: `metric`, `value`, `unit`) |
| GET | /api/saas/health | Health check |

## Run

From **repo root** (so saas-layer is reachable):

```bash
cd NEXUS-ENGINE
export PYTHONPATH=.:saas-layer
cd services/saas-api-service
python run.py
```

Or from `services/saas-api-service` with PYTHONPATH set to include repo root and saas-layer:

```bash
cd NEXUS-ENGINE
PYTHONPATH=.:saas-layer python services/saas-api-service/run.py
```

Service listens on **port 5001**. Frontend proxy sends `/api/saas` to this port.
