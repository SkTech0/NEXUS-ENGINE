# Engine-Optimization Service Shell

Independent runnable service boundary for engine-optimization. No modifications to engine-optimization code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Engine-optimization**: Optimization team

## Run

```bash
npx ts-node service-shells/engine-optimization-service/runner.ts
```

## Config (env)

- `ENGINE_OPTIMIZATION_SERVICE_PORT` (default 3005)
- `ENGINE_OPTIMIZATION_SERVICE_HOST`, `NEXUS_REPO_ROOT`, `NEXUS_ENV`

## Endpoints

- `GET /health`, `GET /ready`, `GET /live`, `GET /api/status`
- `POST /api/optimize` (body: targetId, objective, ...)
