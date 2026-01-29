# Roadmap Governance

## Purpose

Define roadmap governance for NEXUS-ENGINE: how product and engine roadmap (features, versions, deprecations) are planned, prioritized, and communicated. Additive; no change to engine behavior or APIs.

## Principles

- **Roadmap is plan**: Roadmap governance is process for planning and communicating roadmap; engine behavior and API change only when explicitly released per lifecycle (governance/lifecycle-management).
- **Compatibility and deprecation**: Roadmap respects compatibility (governance/compatibility-policy) and deprecation (governance/deprecation-policy); no breaking change without notice.
- **Product and engine**: Roadmap may cover engine features, API product (api-product/), packaging (packaging/), and ecosystem (ecosystem/); EPL governs product side only.

## Roadmap Scope

| Area | Description |
|------|-------------|
| **Engine** | Engine features, API changes; per lifecycle and compatibility |
| **API product** | API plans, quotas, new endpoints; api-product/ |
| **Packaging** | New distributions, formats; packaging/ |
| **Offerings** | New consumption models; offerings/ |
| **Tiers** | Tier changes; tiers/ |
| **Ecosystem** | SDK, plugin, connector, marketplace; ecosystem/ |
| **Distribution** | New regions, marketplaces; distribution/ |
| **Operations** | Support, SLA; operations/ |

## Process

| Aspect | Description |
|--------|-------------|
| **Planning** | Planning cycle (quarterly, annual); org-specific |
| **Prioritization** | Prioritization criteria (customer, compliance, technical debt); org-specific |
| **Communication** | Public or gated roadmap; changelog; org-specific |
| **Dependencies** | Dependency on engine-certification-layer, engine-validation, engine-resilience-layer; org-specific |
| **Deprecation** | Deprecation and sunset in roadmap (governance/deprecation-policy) |

## Engine Alignment

- Roadmap governance does not change engine logic or API; it governs planning and communication. Engine changes follow lifecycle and compatibility.
- No engine regression.

## Certification Readiness

- Roadmap governance documented; planning and communication are org-specific.
- No engine regression.
