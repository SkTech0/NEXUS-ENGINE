# Engine-AI Service Shell

Independent runnable service boundary for engine-ai. Wraps Python inference via adapter; no modifications to engine-ai code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Engine-ai**: AI/ML team

## Run

```bash
npx ts-node service-shells/engine-ai-service/runner.ts
```

## Config (env)

- `ENGINE_AI_SERVICE_PORT` (default 3002)
- `ENGINE_AI_SERVICE_HOST`, `ENGINE_AI_PYTHON_PATH`, `NEXUS_REPO_ROOT`, `NEXUS_ENV`

## Endpoints

- `GET /health`, `GET /ready`, `GET /live`, `GET /api/status`
- `POST /api/infer` — inference via adapter to engine-ai
