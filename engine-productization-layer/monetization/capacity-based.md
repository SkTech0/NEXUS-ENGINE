# Capacity-Based Pricing

## Purpose

Define capacity-based monetization for NEXUS-ENGINE: pricing tied to reserved or committed capacity (nodes, instances, throughput, seats) rather than usage. Additive; no change to engine behavior or APIs.

## Principles

- **Capacity commitment**: Customer pays for reserved capacity (e.g., N nodes, X requests/second, Y seats); usage within capacity may be unmetered or separately metered.
- **Predictable cost**: Suits enterprises that prefer fixed or predictable spend; overage may be billed or blocked.
- **No engine logic change**: Capacity and billing are commercial/platform; engine code and API unchanged.

## Capacity Dimensions

| Dimension | Description | Typical unit |
|-----------|-------------|--------------|
| **Nodes / instances** | Reserved runtime nodes or EaaS dedicated instances | Per node/month or per instance/month |
| **Throughput** | Committed requests per second or per day | Per tier (e.g., 100 RPS, 1M/day) |
| **Seats** | Named users or developers (EaaS or platform) | Per seat/month |
| **Storage** | Reserved storage (if applicable) | Per GB/month |
| **Connections** | Concurrent connections or tenants (if applicable) | Per connection/month |

## Pricing Structure

- **Reserved capacity**: Fixed price per node, instance, or throughput tier; usage within capacity included or separately metered.
- **Overage**: Usage beyond capacity billed (usage-based) or blocked per contract.
- **Enterprise**: Capacity-based common for enterprise tier (tiers/enterprise); annual commitment.
- No engine logic or API changes; capacity pricing is commercial only.

## Commercial Alignment

- Entitlements (commercial/entitlements) encode capacity (nodes, throughput); license validation for runtime (commercial/license-validation).
- Billing (commercial/billing); contract enforcement (commercial/contract-enforcement).
- Runtime license (licensing/runtime); subscription (monetization/subscription).
- No engine regression.

## Certification Readiness

- Capacity-based pricing documented; capacity tiers and billing are org-specific.
- No engine regression.
