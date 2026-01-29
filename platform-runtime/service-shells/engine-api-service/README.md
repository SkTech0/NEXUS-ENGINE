# Engine-API Service Shell

Independent runnable service boundary for engine-api. Spawns the existing .NET application; no modifications to engine-api code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Engine-api**: API team

## Run

```bash
# From repo root (requires .NET SDK)
npx ts-node service-shells/engine-api-service/runner.ts
```

## Config (env)

- `ENGINE_API_SERVICE_PORT` (default 5000)
- `ENGINE_API_SERVICE_HOST` (default 0.0.0.0)
- `ENGINE_API_PROJECT_PATH` — path to EngineApi.csproj
- `DOTNET_PATH` (default dotnet)
- `NEXUS_ENV`, `NEXUS_REPO_ROOT`

## Deployment

Use deployment-shells (Docker, Compose, K8s) for isolated deployment. Docker image typically builds and runs the .NET app directly.
