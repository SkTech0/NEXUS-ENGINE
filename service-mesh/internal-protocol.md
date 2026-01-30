# NEXUS Service Mesh — Internal Protocol

Additive document for inter-service communication. Does not change existing contracts.

## Scope

- Communication between engine-api and extracted engine-* services.
- All internal traffic is HTTP/JSON over the mesh.

## Principles

- **Idempotency**: POST to infer/optimize/verify is idempotent when the same request id is used; clients may retry.
- **No shared state**: Each service is stateless from the mesh perspective; state lives in engine-core or backing stores.
- **Failure isolation**: A failing service does not bring down others; timeouts and circuit breakers apply.
- **Fallback routing**: engine-api may fall back to legacy engine-services (single runtime) when a service is unavailable, if configured.

## Transport

- HTTP/1.1 or HTTP/2
- JSON request/response
- Content-Type: application/json
- No internal mTLS required by default; can be added at infra layer.

## Request/Response

- Every request should include optional headers: X-Request-Id, X-Trace-Id for tracing.
- Responses use standard HTTP status; 2xx success, 4xx client error, 5xx server error.
- Timeouts and retries are defined in timeout-policy.yaml and retry-policy.yaml.
