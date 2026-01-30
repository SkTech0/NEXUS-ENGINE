# Runtime Topology

Post-SEP runtime layout of NEXUS.

## Processes

| Process | Port | Role |
|--------|------|------|
| engine-core | (lib) | Shared kernel; no standalone HTTP by default |
| engine-data-service | 5015 | Wraps engine-data |
| engine-distributed-service | 5016 | Wraps engine-distributed |
| engine-trust-service | 5014 | Wraps engine-trust |
| engine-ai-service | 5011 | Wraps engine-ai |
| engine-intelligence-service | 5012 | Wraps engine-intelligence |
| engine-optimization-service | 5013 | Wraps engine-optimization |
| engine-api | 5000 | Gateway; routes to services or legacy engine-services |
| engine-services (legacy) | 5001 | Single FastAPI runtime; optional fallback |

## Startup Order (DAG)

Defined in `orchestration/services-dag.yaml`:

1. engine-core (lib)
2. engine-data-service
3. engine-distributed-service
4. engine-trust-service
5. engine-ai-service
6. engine-intelligence-service
7. engine-optimization-service
8. engine-api

## Communication

- **engine-api** → **extracted services** via HTTP (ports 5011–5016).
- Routing: `gateway-registry/routing-map.ts` and `service-registry.json`.
- Policies: `service-mesh/` (retry, timeout, circuit breaker).

## Runners

- `runtime-decoupling/services/*-runner.ts` start each Python service, register with orchestration service-registry, and expose health checks.
