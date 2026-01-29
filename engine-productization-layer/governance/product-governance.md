# Product Governance

## Purpose

Define product governance for NEXUS-ENGINE: how product decisions (packaging, offerings, tiers, pricing, distribution) are made, reviewed, and communicated. Additive; no change to engine behavior or APIs.

## Principles

- **Governance is process**: Product governance is decision rights, review, and communication; engine code and API unchanged.
- **Engine-first**: Product decisions preserve engine behavior and API contracts; packaging, pricing, and distribution are additive.
- **Alignment**: Product governance aligns with roadmap (governance/roadmap-governance), lifecycle (governance/lifecycle-management), deprecation (governance/deprecation-policy), and compatibility (governance/compatibility-policy).

## Governance Scope

| Area | Description |
|------|-------------|
| **Packaging** | What distributions, bundles, and formats are offered (packaging/) |
| **Offerings** | What consumption models (EaaS, library, runtime, platform, module, connector) (offerings/) |
| **Tiers** | Tier definitions and tier changes (tiers/) |
| **Pricing** | Pricing and monetization changes (monetization/; commercial/billing) |
| **Distribution** | Distribution channels and regions (distribution/) |
| **API product** | API plans, quotas, rate models (api-product/) |
| **Ecosystem** | SDK, plugin, connector, marketplace (ecosystem/) |
| **Operations** | Support, SLA, customer success (operations/) |
| **Commercial** | Billing, metering, entitlements, license, contract (commercial/) |

## Decision and Review

| Aspect | Description |
|--------|-------------|
| **Decision rights** | Who approves packaging, pricing, tier, distribution changes; org-specific |
| **Review** | Review process (e.g., product, engineering, legal); org-specific |
| **Communication** | How changes are communicated (changelog, email, status page); org-specific |
| **Escalation** | Escalation path for disputes or exceptions; org-specific |

## Engine Alignment

- Product governance does not change engine logic or API; it governs product and commercial layer only.
- No engine regression.

## Certification Readiness

- Product governance documented; decision rights and process are org-specific.
- No engine regression.
