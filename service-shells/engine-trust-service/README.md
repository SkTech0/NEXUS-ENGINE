# Engine-Trust Service Shell

Independent runnable service boundary for engine-trust. No modifications to engine-trust code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Engine-trust**: Trust / Security team

## Run

```bash
npx ts-node service-shells/engine-trust-service/runner.ts
```

## Config (env)

- `ENGINE_TRUST_SERVICE_PORT` (default 3006)
- `ENGINE_TRUST_SERVICE_HOST`, `ENGINE_TRUST_AUDIT_PATH`, `NEXUS_REPO_ROOT`, `NEXUS_ENV`

## Endpoints

- `GET /health`, `GET /ready`, `GET /live`, `GET /api/status`
- `POST /api/verify` (body: principalId, ...)
