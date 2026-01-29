# Product-UI Service Shell

Independent runnable service boundary for product-ui. Spawns the existing Angular app (ng serve); no modifications to product-ui code.

## Ownership

- **Service shell**: Platform / Runtime team
- **Product-ui**: Frontend / UI team

## Run

```bash
# From repo root (requires Node/npx and Angular CLI)
npx ts-node service-shells/product-ui-service/runner.ts
```

## Config (env)

- `PRODUCT_UI_SERVICE_PORT` (default 4200)
- `PRODUCT_UI_SERVICE_HOST`, `PRODUCT_UI_PATH`, `NG_PATH` (default npx)
- `NEXUS_ENV`, `NEXUS_REPO_ROOT`

## Deployment

Use deployment-shells (Docker, Compose, K8s) for isolated deployment. Docker image typically builds static assets and serves via nginx.
