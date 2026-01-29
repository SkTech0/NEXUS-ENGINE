# SLA Tiers

## Purpose

Define SLA tiers for NEXUS-ENGINE: uptime and performance commitments (e.g., 99.5%, 99.9%, 99.95%) that correspond to product tiers and commercial agreements. Additive; no change to engine behavior or APIs.

## Principles

- **Tier-based SLA**: SLA level is tied to product tier (tiers/; api-product/api-tiers); higher tier = higher uptime and/or performance commitment.
- **Enforcement and reporting**: SLA is measured and reported by provider; credits or remedies per contract (org-specific); no engine logic change.
- **Scope**: SLA applies to hosted EaaS or managed engine; self-hosted may have different or no SLA (customer-operated).

## SLA Tier Levels

| Tier | Uptime (typical) | Scope | Remedies |
|------|------------------|-------|----------|
| **Community** | Best-effort | EaaS if offered | None |
| **Developer** | Optional 99% | EaaS | Optional credit |
| **Professional** | 99.5%–99.9% | EaaS, managed | Credit per contract |
| **Enterprise** | 99.9%–99.95% | EaaS, managed | Credit; contractual |
| **Regulated / sovereign** | Contractual | EaaS, managed | Contractual |

## SLA Dimensions

| Dimension | Description |
|-----------|-------------|
| **Uptime** | % of time API or service is available; exclusions (maintenance, customer-caused) per contract |
| **Performance** | Optional: latency P99, throughput; org-specific |
| **Maintenance** | Planned maintenance window; notice and frequency per contract |
| **Measurement** | Monthly or rolling; reporting and credit process (operations/ops-tooling) |
| **Remedies** | Service credit, refund, or other per contract |

## Commercial Alignment

- SLA tier is part of plan and entitlement (commercial/entitlements; api-product/api-plans).
- Contract enforcement (commercial/contract-enforcement); billing and credits (commercial/billing).
- No engine logic or API changes; SLA tiers are operations and commercial only.

## Certification Readiness

- SLA tiers documented; uptime targets and remedies are org-specific.
- No engine regression.
