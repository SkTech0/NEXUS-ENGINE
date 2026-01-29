# Engine-Core Service Shell

Independent runnable service boundary for engine-core. No modifications to engine-core code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Engine-core**: Core Engine team

## Run

```bash
# From repo root
npx ts-node service-shells/engine-core-service/runner.ts
# Or after build
node dist/service-shells/engine-core-service/runner.js
```

## Config (env)

- `ENGINE_CORE_SERVICE_PORT` (default 3001)
- `ENGINE_CORE_SERVICE_HOST` (default 0.0.0.0)
- `NEXUS_ENV` (default development)
- `NEXUS_REPO_ROOT` (default process.cwd())

## Endpoints

- `GET /health`, `GET /api/health` — health
- `GET /ready`, `GET /api/ready` — readiness
- `GET /live`, `GET /api/live` — liveness
- `GET /api/status` — status
- `POST /api/execute` — execute (via adapter)

## Deployment

Use deployment-shells (Docker, Compose, K8s) for isolated deployment.
