# Domain-Driven Design (DDD)

## Bounded contexts

- **Core** — Shared kernel (entities, value objects, interfaces, contracts)
- **Distributed** — Consensus, replication, coordination, state, clocks, messaging
- **Data** — Models, schemas, storage, pipelines, indexing, caching
- **Intelligence** — Reasoning, inference, decision, planning, learning, evaluation
- **Optimization** — Heuristics, solvers, schedulers, allocators, predictors
- **AI** — Models, training, inference, pipelines, features, registry (isolated, API-driven)
- **Trust** — Identity, reputation, verification, security, compliance, audit (independent)
- **SaaS** — Tenancy, auth, subscriptions, usage, licensing; billing hooks only
- **Monetization** — Pricing, billing, payments, invoicing, revenue (does not pollute core)
- **Enterprise** — Compliance, governance, SLA, policies, security (wraps; does not affect core logic)

## Layers (per module)

1. **Domain** — Entities, value objects, domain services, repository interfaces
2. **Application** — Use cases, application services, DTOs
3. **Infrastructure** — Repository implementations, HTTP clients, messaging
4. **Presentation** — API (engine-api gateway), UI (product-ui)

## Dependency rule

Dependencies point inward: infrastructure → application → domain. Domain has no outbound dependencies. Product/UI depends on engines; engines do not depend on product/UI. SaaS wraps engine; monetization does not pollute core intelligence.
