# API Tiers

## Purpose

Define API tiers for NEXUS-ENGINE: tier levels (e.g., Community, Developer, Professional, Enterprise) that group plans and define support, SLA, and commercial treatment for API consumption. Additive; no change to engine behavior or API contracts.

## Principles

- **Tier as level**: Tier = level of service (support, SLA, data residency) that applies to a plan or customer (tiers/; api-product/api-plans).
- **Enforcement at platform**: Tier drives support routing, SLA reporting, and commercial terms; engine is tier-agnostic; no engine logic change.
- **Upgrade path**: Tier upgrade (e.g., Developer → Professional) is plan/subscription change; entitlements updated (commercial/entitlements).

## Tier Levels

| Tier | Support | SLA | Tenancy | Data residency |
|------|---------|-----|---------|----------------|
| Community | Community | Best-effort | Shared | Default |
| Developer | Docs, optional email | Optional 99% | Shared | Default |
| Professional | Email/ticket; business or 24/5 | 99.5%–99.9% | Shared or dedicated | Optional region |
| Enterprise | Dedicated/named; 24/7 optional | 99.9%+ | Dedicated | Contractual |
| Regulated | Dedicated; compliance-aware | Contractual | Dedicated | Jurisdiction |
| Sovereign | Sovereign-aware | Contractual | Sovereign cloud / on-prem | Sovereign |

## API Product Alignment

- API plans reference tier (api-product/api-plans); quotas and rate models may vary by tier (api-product/api-quotas, api-rate-models).
- Support and SLA (operations/support-tiers, sla-tiers) are tier-based.
- No engine logic or API changes; API tiers are product and commercial only.

## Certification Readiness

- API tiers documented; tier definitions and support/SLA are org-specific.
- No engine regression.
