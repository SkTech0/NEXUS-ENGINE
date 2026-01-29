# API Gateway Layer

Single entrypoint for decoupled NEXUS-ENGINE services. Routes requests to service-shells via service registry and discovery.

## Ownership

- **Gateway**: Platform / Runtime team

## Run

```bash
# After service-shells are running (or use discovery defaults)
npx ts-node gateway-layer/api-gateway/gateway.ts
```

## Config (env)

- `GATEWAY_PORT` (default 8080)
- `GATEWAY_HOST` (default 0.0.0.0)
- `GATEWAY_UPSTREAM_HOST` (default localhost) — used by discovery when registry is empty

## Routes

- `/api/core`, `/api/engine` → engine-core-service
- `/api/ai` → engine-ai-service
- `/api/data` → engine-data-service
- `/api/intelligence` → engine-intelligence-service
- `/api/optimization` → engine-optimization-service
- `/api/trust` → engine-trust-service
- `/api/distributed` → engine-distributed-service
- `/api/engine-api`, `/api/loan`, `/swagger` → engine-api-service

## Endpoints

- `GET /health`, `GET /gateway/health` — gateway health
- `GET /gateway/services` — list registered services
