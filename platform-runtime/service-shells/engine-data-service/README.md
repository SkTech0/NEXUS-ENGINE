# Engine-Data Service Shell

Independent runnable service boundary for engine-data. No modifications to engine-data code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Engine-data**: Data team

## Run

```bash
npx ts-node service-shells/engine-data-service/runner.ts
```

## Config (env)

- `ENGINE_DATA_SERVICE_PORT` (default 3003)
- `ENGINE_DATA_SERVICE_HOST`, `ENGINE_DATA_STORAGE_PATH`, `NEXUS_REPO_ROOT`, `NEXUS_ENV`

## Endpoints

- `GET /health`, `GET /ready`, `GET /live`
- `GET /api/get?key=&namespace=`
- `POST /api/put` (body: key, value, namespace)
