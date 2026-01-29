# Professional Edition

## Purpose

Define the professional edition tier for NEXUS-ENGINE: production-ready access for teams and organizations running the engine in production with higher quotas, support, and SLA. Additive; no change to engine behavior or APIs.

## Principles

- **Production-ready**: Professional tier is for production use; quotas, rate limits, and support are sized for production workloads.
- **Support and SLA**: Defined support channel (email, ticket, optional phone) and SLA (e.g., 99.5% uptime) (operations/support-tiers, sla-tiers).
- **License and billing**: Commercial or runtime license; subscription or usage-based pricing (licensing/commercial, runtime; monetization/).

## Tier Characteristics

| Aspect | Professional typical |
|--------|------------------------|
| **License** | Commercial or runtime license for production (licensing/commercial, runtime) |
| **Consumption** | API (EaaS), library, runtime, platform (offerings/) |
| **Quotas** | Production volume; rate limits per plan (api-product/api-quotas) |
| **Support** | Email/ticket; business hours or 24/5 (operations/support-tiers) |
| **SLA** | 99.5% or 99.9% uptime (operations/sla-tiers) |
| **Tenancy** | Shared or optional dedicated (EaaS); self-hosted runtime/library |
| **Data residency** | Optional region selection; no sovereign guarantee |

## Packaging and Distribution

- **EaaS**: Shared or dedicated tenant; professional plan (api-product/api-plans).
- **Library / runtime**: Package or image; commercial/runtime license (packaging/); private registry option.
- **Container**: Private registry; optional signed images (packaging/container-bundles).
- **Deployment**: Kubernetes, cloud, on-prem (distribution/on-prem, cloud-marketplaces).
- No engine logic or API changes; professional tier is product and commercial configuration only.

## Monetization Alignment

- Subscription or usage-based/capacity-based pricing (monetization/subscription, usage-based, capacity-based).
- Metering, billing, and entitlements (commercial/metering, billing, entitlements); contract enforcement (commercial/contract-enforcement).
- No engine regression.

## Certification Readiness

- Professional tier documented; SLA, support, and pricing are org-specific.
- No engine regression.
