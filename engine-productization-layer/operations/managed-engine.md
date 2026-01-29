# Managed Engine

## Purpose

Define the managed engine offering: NEXUS-ENGINE deployed in the customer’s environment (e.g., customer VPC, on-prem) but operated by the provider (provisioning, upgrades, monitoring, patching). Additive; no change to engine behavior or APIs.

## Principles

- **Provider-operated, customer-hosted**: Engine runs on customer infrastructure (or customer-dedicated cloud); provider manages lifecycle, monitoring, and support (operations/hosted-engine is provider-hosted).
- **No engine logic change**: Managed offering is operational model; engine code and API unchanged.
- **Tier alignment**: Managed engine typically for professional, enterprise, regulated (tiers/); SLA and support per tier (operations/sla-tiers, support-tiers).

## Managed Scope

| Aspect | Description |
|--------|-------------|
| **Provisioning** | Provider provisions engine (container, runtime) in customer environment |
| **Upgrades** | Provider manages upgrades and patches; customer approves or auto per contract |
| **Monitoring** | Provider monitors health, metrics, logs; alerting and escalation (operations/ops-tooling) |
| **Patching** | Security and maintenance patches applied by provider |
| **Backup / DR** | Backup and disaster recovery per contract (org-specific) |
| **Support** | Per tier (operations/support-tiers) |

## Offering and Tier Alignment

- **Engine-as-a-runtime** (offerings/engine-as-a-runtime) may be delivered as managed (customer VPC) or self-managed (customer operates).
- **Enterprise / regulated**: Managed engine common for enterprise and regulated tiers (tiers/enterprise, regulated).
- **License**: Runtime or enterprise license (licensing/runtime, enterprise); billing may be subscription or capacity (monetization/subscription, capacity-based).
- No engine logic or API changes; managed engine is operations only.

## Certification Readiness

- Managed engine documented; provisioning and support are org-specific.
- No engine regression.
