# Domain-Driven Design (DDD)

## Bounded contexts

- **Core** — Shared kernel (entities, value objects, ports)
- **Distributed** — Coordination and distribution
- **Data** — Persistence and repositories
- **Intelligence** — Decisions and reasoning
- **Optimization** — Scheduling and optimization
- **AI** — Inference and ML (Python)
- **Trust** — Security and identity
- **SaaS** — Tenancy and product surface

## Layers (per module)

1. **Domain** — Entities, value objects, domain services, repository interfaces
2. **Application** — Use cases, application services, DTOs
3. **Infrastructure** — Repository implementations, HTTP clients, messaging
4. **Presentation** — API controllers, UI (product-ui)

## Dependency rule

Dependencies point inward: infrastructure → application → domain. Domain has no outbound dependencies.
