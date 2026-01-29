# Service Shells

Wrapper-based decoupling for NEXUS-ENGINE. Each major system is wrapped with an independent service shell: own config, health, lifecycle, adapter, server, and runner. No modifications to existing engine code.

## Services

| Service | Port (default) | Runner |
|---------|----------------|--------|
| engine-core-service | 3001 | service-shells/engine-core-service/runner.ts |
| engine-api-service | 5000 | service-shells/engine-api-service/runner.ts (spawns dotnet) |
| engine-ai-service | 3002 | service-shells/engine-ai-service/runner.ts |
| engine-data-service | 3003 | service-shells/engine-data-service/runner.ts |
| engine-intelligence-service | 3004 | service-shells/engine-intelligence-service/runner.ts |
| engine-optimization-service | 3005 | service-shells/engine-optimization-service/runner.ts |
| engine-trust-service | 3006 | service-shells/engine-trust-service/runner.ts |
| engine-distributed-service | 3007 | service-shells/engine-distributed-service/runner.ts |
| product-ui-service | 4200 | service-shells/product-ui-service/runner.ts (spawns ng serve) |

## Per-Service Layout

Each `*-service/` folder contains:

- **config.ts** — Independent config (port, host, env).
- **health.ts** — Health, readiness, liveness probes.
- **lifecycle.ts** — Startup/shutdown hooks.
- **adapter.ts** — Invocation to underlying system (no changes to that code).
- **server.ts** — HTTP server or process launcher.
- **runner.ts** — Entrypoint.
- **README.md** — Ownership and run instructions.

## Run (from repo root)

```bash
# Single service (example)
npx ts-node service-shells/engine-core-service/runner.ts

# Or use nx/scripts that invoke these runners.
```

## Ownership

Service shells are owned by **Platform / Runtime**. Domain logic remains owned by the teams that own engine-core, engine-api, engine-ai, etc. See team-boundaries/.
