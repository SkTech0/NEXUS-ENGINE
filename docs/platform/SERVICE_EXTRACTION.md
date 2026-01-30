# Service Extraction (SEP)

**Phase:** Operational decoupling — from conceptual decoupling to real distributed runtime.

## Purpose

Transform NEXUS from a single FastAPI runtime (engine-services) into multiple independent services. This is **not** refactoring: no business logic, contracts, or engine internals are changed. Everything is additive.

## What Was Done

- **New top-level folder `services/`** with six service shells:
  - engine-ai-service
  - engine-intelligence-service
  - engine-optimization-service
  - engine-trust-service
  - engine-data-service
  - engine-distributed-service

- Each service has:
  - `app/` (main.py, api.py, service.py, config.py, health.py, lifecycle.py)
  - `contracts/ports.py` (engine-core port bindings)
  - `adapters/engine_adapter.py` (connects to engine-core)
  - `infra/` (Dockerfile, service.yaml, ports.yaml)
  - `run.py`, `README.md`

- **gateway-registry/** — service-registry.json, service-discovery.ts, routing-map.ts for engine-api → services routing and dynamic discovery.

- **orchestration/services-dag.yaml** — startup order and dependencies.

- **runtime-decoupling/services/** — runners (engine-ai-runner.ts, etc.) that start each service process, load config, register with gateway, expose health.

- **service-mesh/** — internal-protocol.md, http-contracts.yaml, retry-policy.yaml, timeout-policy.yaml, circuit-breaker.yaml.

- **observability/services/** — tracing.yaml, metrics.yaml, logging.yaml, health-model.yaml per service.

- **deploy/services/** — docker-compose.yaml and k8s.yaml per service.

## Non-Goals

- Feature building, product building, UI changes.
- Logic refactoring, engine merging, API redesign.
- Performance tuning, optimization, AI model changes.

## Outcome

NEXUS becomes multi-process, multi-service, runtime-isolated, deployment-isolated, failure-isolated, team-scalable, cloud-native, platform-grade, and engine-commercialization-ready.
