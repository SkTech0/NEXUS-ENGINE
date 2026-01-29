# Responsibility Matrix

RACI-style responsibility for NEXUS-ENGINE decoupled services and platform.

## Legend

- **R** Responsible (does the work)
- **A** Accountable (owns outcome)
- **C** Consulted
- **I** Informed

## Service Logic (per service)

| Activity | Owning Team | Platform | Others |
|----------|-------------|----------|--------|
| Feature development | R | I | — |
| Bug fixes (in-domain) | R | I | — |
| API/contract changes | R (producer) | C | Consumers (C) |
| Tests (unit, integration for service) | R | I | — |
| Release of service code | R | I | — |

## Service Shells & Runtime

| Activity | Owning Team | Platform | Others |
|----------|-------------|----------|--------|
| Shell config defaults | C | R, A | — |
| Health/readiness/liveness | C | R, A | — |
| Lifecycle (startup/shutdown) | C | R, A | — |
| Adapter (invoke underlying service) | C | R, A | — |
| Runner entrypoint | C | R, A | — |
| New service shell for new service | — | R, A | Owning team (C) |

## Gateway & Orchestration

| Activity | Owning Team | Platform | Others |
|----------|-------------|----------|--------|
| Route definitions | C | R, A | — |
| Service registry / discovery | — | R, A | — |
| Dependency map updates | C | R, A | — |
| Lifecycle order (startup/shutdown) | C | R, A | — |

## Deployment

| Activity | Owning Team | Platform / SRE | Others |
|----------|-------------|----------------|--------|
| Dockerfile (per service) | I | R, A | — |
| Compose file (per service) | I | R, A | — |
| K8s manifests (per service) | I | R, A | — |
| CI/CD pipeline (per service) | R (optional) | R, A | — |
| Production deploy | — | R, A | Owning team (I) |
| Rollback | — | R, A | Owning team (I) |

## Summary

- **Teams** are R for their service **logic** and A for its correctness and delivery.
- **Platform** is R and A for **shells, gateway, orchestration, and deployment**; teams are C where their service is involved and I on releases/changes.
