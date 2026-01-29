# Service Ownership

Independent service ownership for NEXUS-ENGINE decoupled services.

## Principles

- **One service, one owner.** Each runnable service has a single owning team.
- **Process boundary = ownership boundary.** What runs inside the process is owned by the team; the process shell is platform-owned.
- **No shared code ownership.** Teams do not edit each other’s service logic; they integrate via APIs and gateway.

## Ownership Matrix

| Service | Owner | Scope | Out of Scope |
|---------|-------|--------|--------------|
| engine-core | Core Engine | engine-core/* logic, contracts, domain | service-shells, gateway, orchestration |
| engine-api | API / Backend | engine-api/* logic, controllers, services | service-shells, gateway |
| engine-ai | AI/ML | engine-ai/* models, inference, training | service-shells, gateway |
| engine-data | Data | engine-data/* repositories, storage | service-shells, gateway |
| engine-intelligence | Intelligence | engine-intelligence/* evaluation, context | service-shells, gateway |
| engine-optimization | Optimization | engine-optimization/* optimize, objectives | service-shells, gateway |
| engine-trust | Trust / Security | engine-trust/* verify, audit, identity | service-shells, gateway |
| engine-distributed | Distributed Systems | engine-distributed/* coordinator, tasks | service-shells, gateway |
| product-ui | Frontend / UI | product-ui/* components, routes, services | service-shells, gateway |

## Platform Ownership

- **Service shells** (runner, server, config, health, lifecycle, adapter): Platform / Runtime.
- **Gateway** (routes, discovery, registry): Platform / Runtime.
- **Orchestration** (registry, discovery, dependency-map, lifecycle-manager): Platform / Runtime.
- **Deployment shells** (Docker, Compose, K8s): Platform / SRE.

## Escalation

- Service logic bugs → owning team.
- Shell/runtime/gateway/orchestration/deployment issues → Platform / Runtime or SRE per team-boundaries/escalation-paths.md.
