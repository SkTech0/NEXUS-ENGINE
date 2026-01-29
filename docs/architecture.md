# Nexus Engine — Architecture

## Overview

Nexus Engine is an Nx monorepo with microservices and shared libraries.

## Boundaries

| Layer | Purpose |
|-------|--------|
| **engine-core** | Domain kernel, entities, value objects, ports |
| **engine-distributed** | Coordination and distribution logic |
| **engine-data** | Persistence, repositories, data access |
| **engine-intelligence** | Decision and reasoning logic |
| **engine-optimization** | Scheduling and optimization |
| **engine-ai** | Python AI/ML inference engines |
| **engine-trust** | Security, identity, audit |
| **engine-api** | .NET 10 HTTP API gateway |
| **product-ui** | Angular 18 SPA |
| **saas-layer** | Multi-tenant and SaaS surface |
| **infra** | Deployment and infrastructure |
| **docs** | Documentation |

## Tech Stack

- **Nx** — Monorepo tooling
- **Angular 18** — product-ui
- **.NET 10** — engine-api and backend services
- **Python 3.11+** — engine-ai
- **TypeScript** — Strict mode, shared libs
- **ESLint + Prettier** — Linting and formatting

## Clean Architecture / DDD

- **Domain** — Entities, value objects, domain services
- **Application** — Use cases, application services
- **Infrastructure** — Adapters (DB, HTTP, messaging)
- **Ports** — Interfaces for external systems
