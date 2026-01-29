# Developer Edition

## Purpose

Define the developer edition tier for NEXUS-ENGINE: access for developers and teams building and testing applications on top of the engine, with higher quotas and optional paid support. Additive; no change to engine behavior or APIs.

## Principles

- **Build and test**: Developer tier supports active development, integration, and testing; not necessarily production at scale.
- **Quotas and rate limits**: Higher than community; lower than professional/enterprise (api-product/api-quotas, api-rate-models).
- **Optional paid support**: Email or ticket support; optional SLA (operations/support-tiers, sla-tiers).

## Tier Characteristics

| Aspect | Developer typical |
|--------|--------------------|
| **License** | Commercial or usage license for dev/test (licensing/commercial, usage) |
| **Consumption** | API (EaaS), library, runtime (offerings/) |
| **Quotas** | Medium request volume; dev/test or small production |
| **Support** | Documentation, community; optional email/ticket support (operations/support-tiers) |
| **SLA** | Optional 99% or best-effort (operations/sla-tiers) |
| **Tenancy** | Shared (EaaS) or self-hosted runtime/library |
| **Data residency** | Provider default unless paid option |

## Packaging and Distribution

- **EaaS**: Shared tenant; developer plan (api-product/api-plans).
- **Library / runtime**: Package or image; commercial or usage license (packaging/, licensing/commercial).
- **Container**: Public or private registry per org (packaging/container-bundles).
- No engine logic or API changes; developer tier is product and commercial configuration only.

## Monetization Alignment

- Subscription (monthly/annual) or usage-based with developer pricing (monetization/subscription, usage-based).
- Metering and billing apply (commercial/metering, billing); entitlements per plan (commercial/entitlements).
- No engine regression.

## Certification Readiness

- Developer tier documented; quotas, support, and pricing are org-specific.
- No engine regression.
