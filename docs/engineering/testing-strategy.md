# Testing Strategy

## Overview

Nexus Engine uses a layered testing approach: unit, integration, contract, engine flow, chaos, and load tests.

## Layers

### 1. Unit Tests

- **product-ui**: Karma + Jasmine, `product-ui/src/app/tests/`, `nx test product-ui`
- **engine-api**: xUnit + Moq + FluentAssertions, `engine-api/tests/EngineApi.Tests`
- **Python engines**: pytest, `engine-*/tests/` (`test_core`, `test_pipeline`, `test_engine`, `test_flow`)

### 2. Integration Tests

- **engine-api**: `EngineApiIntegrationTests` with `WebApplicationFactory`, in-memory test server
- **Engine flow**: `scripts/test-engine-flow.sh`, `scripts/test-api.sh` (curl against running API)

### 3. Contract Tests

- OpenAPI contracts in `contracts/` (`engine-api.yaml`, `ai-api.yaml`, `optimization-api.yaml`, `trust-api.yaml`)
- Validate API responses against contracts (tooling TBD)

### 4. Engine Flow Tests

- `scripts/test-engine-flow.sh` — Health → Engine → Intelligence → Optimization → AI → Trust
- `scripts/test-api.sh`, `test-ai.sh`, `test-data.sh`, `test-distributed.sh`

### 5. Chaos & Load

- `scripts/chaos-test.sh` — Lightweight stress; Chaos Mesh for k8s
- `scripts/load-test.sh` — k6 or curl-based load
- `scripts/load-test-k6.js` — k6 script

## Test Data

- `test-data/mock-data.json`, `synthetic-data.json`, `load-data.json`, `ai-data.json`

## Coverage

- Targets: > 80% line (see `quality/coverage-rules.yml`)
- UI: `nx test product-ui --codeCoverage`
- API: `dotnet test --collect:"XPlat Code Coverage"`
- Engines: `pytest --cov`

## Running Tests

- `./run-tests.sh` — All tests
- `./run-ci.sh` — CI-style (lint, build, test)
