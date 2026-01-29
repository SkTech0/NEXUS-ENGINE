# Hosted Engine

## Purpose

Define the hosted engine offering: NEXUS-ENGINE operated by the provider on provider (or provider-dedicated) infrastructure; customer consumes via API only (EaaS). Additive; no change to engine behavior or APIs.

## Principles

- **Provider-hosted and operated**: Engine runs on provider infrastructure; customer has no artifact and no infrastructure; consumption is API-only (offerings/engine-as-a-service).
- **No engine logic change**: Hosted offering is operational and delivery model; engine code and API unchanged.
- **Tenancy**: Multi-tenant (shared) or dedicated per tier (tiers/; operations/sla-tiers).

## Hosted Scope

| Aspect | Description |
|--------|-------------|
| **Infrastructure** | Provider-owned or dedicated cloud; customer does not manage servers |
| **Consumption** | API-only; SDK for client (packaging/api-bundles, sdk-bundles) |
| **Tenancy** | Shared (multi-tenant) or dedicated per tier |
| **Operations** | Provisioning, upgrades, monitoring, DR by provider (operations/ops-tooling) |
| **Support** | Per tier (operations/support-tiers) |
| **SLA** | Per tier (operations/sla-tiers) |
| **Billing** | Subscription, usage-based, or capacity (monetization/; commercial/billing) |

## Offering Alignment

- Hosted engine = engine-as-a-service (offerings/engine-as-a-service); API plans and quotas apply (api-product/).
- **Managed engine** (operations/managed-engine) = provider-operated in customer environment; **hosted** = provider-operated on provider environment.
- No engine logic or API changes; hosted engine is operations only.

## Certification Readiness

- Hosted engine documented; tenancy and operations are org-specific.
- No engine regression.
