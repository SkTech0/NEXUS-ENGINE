# Failure Domains

Post-SEP failure isolation model.

## Per-Service Failure Domain

Each extracted service is a **failure domain**:

- **engine-ai-service** — failure in AI does not take down optimization, trust, data, or distributed.
- **engine-intelligence-service** — isolated from AI, optimization, trust, data, distributed.
- **engine-optimization-service** — isolated from others.
- **engine-trust-service** — isolated from others.
- **engine-data-service** — isolated from others.
- **engine-distributed-service** — isolated from others.

## Mitigations

- **Circuit breaker** (`service-mesh/circuit-breaker.yaml`): Per-service; one open circuit does not affect others.
- **Timeout** (`service-mesh/timeout-policy.yaml`): Prevents one slow service from blocking the gateway.
- **Retry** (`service-mesh/retry-policy.yaml`): Transient failures; idempotent POSTs where defined.
- **Fallback:** engine-api may route to legacy engine-services (single runtime) when a service is down, if configured.

## Health

- Each service exposes `/health`.
- Gateway and orchestrators use health for routing and readiness.
- Observability: `observability/services/health-model.yaml`.

## No Cascading by Design

- No shared in-process state between services.
- Timeouts and circuit breakers prevent one failing or slow service from holding the gateway or other services.
