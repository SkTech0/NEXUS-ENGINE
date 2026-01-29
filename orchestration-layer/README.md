# Orchestration Layer

Orchestration for decoupled NEXUS-ENGINE service-shells: service registry, discovery, dependency map, lifecycle order.

## Ownership

- **Orchestration**: Platform / Runtime team

## Contents

- **service-registry.ts** — In-memory registry of service-shell base URLs (for gateway and orchestration).
- **discovery.ts** — Resolve service name to URL via env/default ports.
- **dependency-map.ts** — Dependency graph; startup/shutdown order.
- **orchestration.ts** — Resolve URLs, health-check all, startup/shutdown order helpers.
- **lifecycle-manager.ts** — Startup/shutdown phases, wait-for-service, recommended sequences.

## Usage

Use from gateway or from startup scripts to:

1. Resolve service URLs (discovery or registry).
2. Start services in dependency order (getStartupOrder).
3. Stop services in reverse order (getShutdownOrder).
4. Health-check all (orchestration.healthCheckAll).

## Config (env)

- `ORCHESTRATION_UPSTREAM_HOST` (default localhost) — used by discovery.

## No Engine Code Changes

This layer only references service names and ports; it does not import or modify engine-core, engine-api, or any other engine package.
