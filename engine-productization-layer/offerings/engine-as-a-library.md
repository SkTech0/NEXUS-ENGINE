# Engine-as-a-Library

## Purpose

Define the engine-as-a-library offering: NEXUS-ENGINE consumed as an embeddable library (npm, PyPI, NuGet, etc.) that customers integrate into their own applications. Additive; no change to engine behavior or API contracts.

## Principles

- **Embeddable**: Engine is a dependency; customer builds and runs their app; engine runs in-process or as a linked component (packaging/runtime-bundles, sdk-bundles as library variant).
- **License-driven**: Commercial or embedded license typically required for production use (licensing/commercial, embedded); community may have OSS or usage-capped (licensing/oss, usage).
- **No hosting by provider**: Customer is responsible for deployment, scaling, and operations; support and SLA per tier (operations/support-tiers, sla-tiers).

## Offering Characteristics

| Aspect | Description |
|--------|-------------|
| **Delivery** | Package manager (npm, PyPI, NuGet); versioned releases (packaging/distributions, sdk-bundles) |
| **Integration** | In-process or local process; customer code calls engine API or SDK |
| **License** | OSS (community), commercial, or embedded per tier (licensing/) |
| **Support** | Documentation, community, or paid support per tier (operations/support-tiers) |
| **Upgrades** | Customer pulls new versions; compatibility policy applies (governance/compatibility-policy) |

## Tier and License Mapping

| Tier | Library offering |
|------|------------------|
| Community | OSS or limited-use library; public package |
| Developer | Dev/test use; commercial or usage license |
| Professional | Production embedding; commercial or embedded license |
| Enterprise | Production; enterprise license; support and SLA |
| Regulated / sovereign | Licensed library; compliance and distribution constraints (distribution/air-gapped, sovereign-cloud) |

## Monetization Alignment

- Subscription or perpetual license for library use (monetization/subscription); or usage-based if telemetry/cap is supported (monetization/usage-based).
- License validation optional at load or first use (commercial/license-validation); no engine logic change—validation is pluggable layer.
- No engine logic or API changes; library offering is packaging and license model only.

## Certification Readiness

- Engine-as-a-library offering documented; packaging and license enforcement are org-specific.
- No engine regression.
