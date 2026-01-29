# Engine-Distributed Service Shell

Independent runnable service boundary for engine-distributed. No modifications to engine-distributed code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Engine-distributed**: Distributed Systems team

## Run

```bash
npx ts-node service-shells/engine-distributed-service/runner.ts
```

## Config (env)

- `ENGINE_DISTRIBUTED_SERVICE_PORT` (default 3007)
- `ENGINE_DISTRIBUTED_SERVICE_HOST`, `NEXUS_REPO_ROOT`, `NEXUS_ENV`

## Endpoints

- `GET /health`, `GET /ready`, `GET /live`, `GET /api/status`
- `POST /api/coordinate` (body: taskId, payload, ...)
