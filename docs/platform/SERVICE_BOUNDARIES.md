# Service Boundaries

Each engine is an independent service with clear boundaries.

## Principles

- **One engine = one service.** No merging of engines.
- **Shared contracts only via engine-core.** Services depend on engine-core as lib; no cross-service business contracts.
- **Independent deployment, scaling, failure, ownership, lifecycle, config, observability, CI/CD.**

## Service vs Engine

| Service | Wraps Engine | Exposed API Prefixes |
|---------|--------------|----------------------|
| engine-ai-service | engine-ai | /api/AI |
| engine-intelligence-service | engine-intelligence | /api/Intelligence, /api/Engine (execute) |
| engine-optimization-service | engine-optimization | /api/Optimization |
| engine-trust-service | engine-trust | /api/Trust |
| engine-data-service | engine-data | /api/Data |
| engine-distributed-service | engine-distributed | /api/Distributed |

## Boundaries Enforced By

- **Process:** Each service is a separate process (Python/uvicorn).
- **Port:** Each service binds to its own port (5011–5016).
- **Config:** Per-service env (e.g. ENGINE_AI_SERVICE_PORT).
- **Deploy:** Per-service Docker/Kubernetes in `deploy/services/`.
- **Observability:** Per-service tracing, metrics, logging, health in `observability/services/`.

## No Cross-Service Business Logic

- Services do not call each other for business flows; engine-api orchestrates.
- Shared logic stays in engine-core; services adapt via `contracts/ports.py` and `adapters/engine_adapter.py`.
