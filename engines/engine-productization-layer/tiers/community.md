# Community Edition

## Purpose

Define the community edition tier for NEXUS-ENGINE: free or low-cost access to the engine for evaluation, learning, and non-commercial or limited commercial use. Additive; no change to engine behavior or APIs.

## Principles

- **Access-first**: Lower barrier to adoption; engine available as OSS or freemium (licensing/oss, usage).
- **Limited scope**: Usage caps, rate limits, or feature restrictions per plan (api-product/api-quotas, api-rate-models); no custom SLA or dedicated support (operations/support-tiers).
- **Ecosystem growth**: Community tier drives adoption, feedback, and ecosystem (ecosystem/); upgrade path to developer/professional/enterprise documented.

## Tier Characteristics

| Aspect | Community typical |
|--------|--------------------|
| **License** | OSS or limited-use commercial (licensing/oss, usage) |
| **Consumption** | API (EaaS), library, or runtime with caps (offerings/) |
| **Quotas** | Low request volume, rate limits; dev/eval only or limited production |
| **Support** | Community (forums, docs); no guaranteed SLA (operations/support-tiers) |
| **SLA** | Best-effort; no uptime guarantee (operations/sla-tiers) |
| **Tenancy** | Shared multi-tenant (if EaaS) |
| **Data residency** | Provider default; no guarantee |

## Packaging and Distribution

- **EaaS**: Shared tenant; API plans with community quotas (api-product/api-plans).
- **Library / runtime**: Public package or image; OSS or usage-capped license (packaging/, licensing/oss).
- **Container**: Public registry; standard or minimal image (packaging/container-bundles).
- No engine logic or API changes; community tier is product and commercial configuration only.

## Monetization Alignment

- Free or usage-based with generous free tier (monetization/usage-based); optional subscription for “community plus” (monetization/subscription).
- Metering and billing may be minimal or zero for community (commercial/metering, billing).
- No engine regression.

## Certification Readiness

- Community tier documented; quotas and support are org-specific.
- No engine regression.
