# Engine-Intelligence Service Shell

Independent runnable service boundary for engine-intelligence. No modifications to engine-intelligence code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Engine-intelligence**: Intelligence team

## Run

```bash
npx ts-node service-shells/engine-intelligence-service/runner.ts
```

## Config (env)

- `ENGINE_INTELLIGENCE_SERVICE_PORT` (default 3004)
- `ENGINE_INTELLIGENCE_SERVICE_HOST`, `NEXUS_REPO_ROOT`, `NEXUS_ENV`

## Endpoints

- `GET /health`, `GET /ready`, `GET /live`, `GET /api/status`
- `POST /api/evaluate` (body: context, inputs)
