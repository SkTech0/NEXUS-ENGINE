# API Bundles

## Purpose

Define API bundles for NEXUS-ENGINE: productized packaging of the engine’s API surface for distribution as a consumable API product (plans, tiers, quotas, rate models). Additive; no change to engine API contracts or behavior.

## Principles

- **Contract-preserving**: API bundles wrap the existing engine API (contracts/engine-api, ai-api, optimization-api, trust-api); no modification to paths, schemas, or semantics.
- **Product layer**: Bundles define how the API is exposed as a product—plan names, tier limits, quota and rate rules—enforced at gateway or platform, not in engine.
- **Consumption-aligned**: API bundle = logical product unit (e.g., “Intelligence API bundle”, “Optimization API bundle”) for pricing and entitlement (api-product/, commercial/entitlements).

## Bundle Definition

| Element | Description |
|---------|-------------|
| **API surface** | Subset or full set of engine endpoints (Health, Engine, Intelligence, Optimization, AI, Trust) |
| **Plan/tier** | Mapping to api-product/api-plans, api-tiers |
| **Quotas** | Request volume, rate limits (api-product/api-quotas, api-rate-models) |
| **Auth model** | API key, OAuth2, mTLS—gateway/platform concern |
| **Documentation** | OpenAPI export, versioned; same as contracts/ + product extensions (usage, examples) |

## Relationship to Engine

- Engine continues to serve requests; gateway or BFF applies plan, quota, rate limit, and billing (commercial/metering, usage-tracking).
- API bundle is a product construct; implementation is gateway/config and commercial ops.
- No engine logic or API contract changes; API bundles are productization only.

## Tier and Offering Alignment

- **EaaS**: API bundle is the primary deliverable; no artifact (offerings/engine-as-a-service).
- **Platform**: API bundle + SDK and ecosystem (offerings/engine-as-a-platform, ecosystem/).
- **Developer / professional / enterprise**: Different API plans and quotas per tier (api-product/api-plans, api-tiers).

## Certification Readiness

- API bundle model documented; gateway and plan configuration are org-specific.
- No engine regression.
