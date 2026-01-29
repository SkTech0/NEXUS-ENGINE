# Restructure Summary

The repo was restructured so the project looks simpler and each part is independently runnable.

## What changed

### New top-level folders

| Folder | Contents |
|--------|----------|
| **apps/** | product-ui, engine-api (user-facing applications) |
| **engines/** | engine-core, engine-ai, engine-data, engine-intelligence, engine-optimization, engine-trust, engine-distributed, saas-layer, engine-*-layer (all engine logic) |
| **platform-runtime/** | service-shells, gateway-layer, orchestration-layer, runtime-decoupling |
| **deploy/** | docker/, compose/, k8s/ (moved from deployment-shells/) |

### Path updates

- **Nx / Angular**: `angular.json`, `tsconfig.base.json`, and all `project.json` files now use `apps/`, `engines/`, `platform-runtime/` paths.
- **Service shells**: Config paths point to `apps/engine-api`, `apps/product-ui`, `engines/engine-ai`, etc.
- **Deploy**: Dockerfiles and Compose files use `deploy/docker/`, `deploy/compose/`, and copy from `apps/`, `engines/`, `platform-runtime/`.
- **Scripts**: `run-api.sh` uses `apps/engine-api/...`.

### Unchanged

- **specs/** now holds all spec/policy folders: contracts, certification, governance, gates, products, api-platform, market-readiness, release, ops, quality, reports, versioning, security, team-boundaries. **infra/**, **docs/**, **config/**, **env/**, **secrets/**, **scripts/** remain at repo root.
- **engine-productization-layer-copy/** remains at root (legacy copy).

## How to run after restructure

```bash
# UI
npx nx serve product-ui

# API
./run-api.sh

# One engine service (e.g. engine-core)
npx ts-node platform-runtime/service-shells/engine-core-service/runner.ts

# Docker (from repo root)
docker compose -f deploy/compose/engine-api.yml up -d
docker compose -f deploy/compose/product-ui.yml up -d
```

## Build from repo root

```bash
npm install
npx nx run-many --target=build --all
```

If `product-ui:build` fails with module-resolution errors, run `npm install` from repo root and ensure Node/npm versions match the project (Angular 18, Node 18+). All paths are relative to repo root; no folder was renamed without updating references.
