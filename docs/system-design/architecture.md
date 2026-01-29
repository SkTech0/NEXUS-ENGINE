# Nexus Engine — Architecture

## Overview

Nexus Engine is an Nx monorepo with microservices and shared libraries. Engine-first, clean architecture, DDD.

## Boundaries

| Layer | Purpose |
|-------|--------|
| **engine-core** | Domain kernel, entities, value objects, interfaces, contracts |
| **engine-distributed** | Consensus, replication, coordination, state, clocks, messaging |
| **engine-data** | Models, schemas, storage, pipelines, indexing, caching |
| **engine-intelligence** | Reasoning, inference, decision, planning, learning, evaluation |
| **engine-optimization** | Heuristics, solvers, schedulers, allocators, predictors |
| **engine-ai** | Models, training, inference, pipelines, features, registry |
| **engine-trust** | Identity, reputation, verification, security, compliance, audit |
| **engine-api** | Gateway-only: Controllers, Services, DTOs, Middleware, Repositories |
| **product-ui** | Presentation-only: shell, dashboard, visualization, monitoring |
| **saas-layer** | Tenancy, auth, billing hooks, subscriptions, usage, licensing |
| **monetization** | Pricing, billing, payments, invoicing, revenue (no core logic) |
| **platform** | Plugins, integrations, extensions, marketplace, registry |
| **enterprise** | Compliance, governance, SLA, policies, security |
| **infra** | Docker, k8s, terraform, helm, ci-cd |
| **docs** | Research, thesis, papers, system-design, startup, investor, legal |

## Tech Stack

- **Nx** — Monorepo tooling
- **Angular 18** — product-ui
- **.NET 10** — engine-api (gateway)
- **Python 3.11+** — engine-ai, engine-data, engine-distributed, engine-intelligence, engine-optimization, engine-trust, saas-layer, monetization, platform, enterprise
- **TypeScript** — Strict mode, engine-core and product-ui

## Clean Architecture / DDD

- **Domain** — Entities, value objects, domain services
- **Application** — Use cases, application services
- **Infrastructure** — Adapters (DB, HTTP, messaging)
- **Interfaces / Contracts** — engine-core; implementations in engines
- **Dependency rule**: Infrastructure → Application → Domain; Product/UI depends on engines, not vice versa.
