# Engine-as-a-Module

## Purpose

Define the engine-as-a-module offering: NEXUS-ENGINE consumed as a composable module or component that can be combined with other modules in a larger system (e.g., decision service, optimization service, intelligence service). Additive; no change to engine behavior or APIs.

## Principles

- **Composable**: Engine is one module among many; clear boundaries (API, config, lifecycle); no tight coupling to a single host.
- **Library or runtime**: Delivered as library (offerings/engine-as-a-library) or as a sidecar/microservice (engine-as-a-runtime); “module” emphasizes composition, not delivery format.
- **Contract-bound**: Module exposes stable API and config contract; compatibility and deprecation governed (governance/compatibility-policy, deprecation-policy).

## Offering Characteristics

| Aspect | Description |
|--------|-------------|
| **Boundary** | Engine API and config schema define the module contract (contracts/) |
| **Delivery** | Library package or container/runtime (packaging/) |
| **Composition** | Customer embeds or orchestrates engine alongside other services |
| **License** | Per tier; embedded or runtime license common (licensing/embedded, runtime) |
| **Versioning** | Module version = engine version; compatibility policy applies |

## Use Cases

- **Decision service**: Engine as decision/evaluation module in a larger app (engine-intelligence, engine-api).
- **Optimization service**: Engine as optimization module in workflows (engine-optimization).
- **Trust/audit module**: Engine trust and audit as a composable service (engine-trust).
- **Intelligence module**: Evaluation, inference, planning as a module (engine-intelligence).

## Tier and Licensing

| Tier | Module offering |
|------|-----------------|
| Community | OSS or limited module; public package |
| Developer | Dev/test module; commercial or usage license |
| Professional / enterprise | Production module; embedded or runtime license; support |
| Regulated / sovereign | Licensed module; compliance and distribution constraints |

## Certification Readiness

- Engine-as-a-module offering documented; packaging and composition are org-specific.
- No engine logic or API changes; module offering is productization only.
- No engine regression.
