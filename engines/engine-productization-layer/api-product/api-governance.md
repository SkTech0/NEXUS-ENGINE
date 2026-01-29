# API Governance

## Purpose

Define API governance for NEXUS-ENGINE: policies and processes for API versioning, deprecation, compatibility, rate limits, abuse prevention, and change management. Additive; no change to engine behavior or API contracts.

## Principles

- **Contract-preserving**: Governance applies to how the API is exposed and evolved; engine API contracts (contracts/) remain source of truth; no engine logic change.
- **Lifecycle alignment**: API lifecycle (versioning, deprecation, compatibility) aligns with governance/lifecycle-management, deprecation-policy, compatibility-policy.
- **Enforcement at platform**: Governance policies are enforced at gateway, docs, and release process; engine is unaware of governance layer.

## Governance Areas

| Area | Description |
|------|-------------|
| **Versioning** | API version in path or header; semver alignment (governance/compatibility-policy) |
| **Deprecation** | Deprecation timeline, sunset date, migration path (governance/deprecation-policy) |
| **Compatibility** | Backward compatibility rules; breaking vs non-breaking (governance/compatibility-policy) |
| **Rate and quota** | Rate limit and quota policy; abuse prevention (api-product/api-rate-models, api-quotas) |
| **Change process** | How API changes are proposed, reviewed, released (governance/roadmap-governance) |
| **Documentation** | OpenAPI, versioned docs, changelog (contracts/; governance/lifecycle-management) |

## Engine Alignment

- Engine API (contracts/engine-api, ai-api, optimization-api, trust-api) is the contract; governance defines product and process around it.
- No engine logic or API changes; API governance is product and process only.

## Certification Readiness

- API governance documented; versioning and deprecation process are org-specific.
- No engine regression.
