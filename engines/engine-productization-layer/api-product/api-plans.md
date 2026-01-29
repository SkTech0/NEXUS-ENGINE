# API Plans

## Purpose

Define API plans for NEXUS-ENGINE: named plans that map to tier, quotas, rate limits, and features for API consumption (EaaS, platform). Additive; no change to engine behavior or API contracts.

## Principles

- **Plan as product unit**: Plan = named offering (e.g., Community, Developer, Professional, Enterprise) with associated quotas, rate limits, and features (api-product/api-quotas, api-rate-models, api-tiers).
- **Enforcement at gateway**: Plan is enforced at API gateway or BFF; engine receives requests that have already passed plan checks; no engine logic change.
- **Entitlement alignment**: Plan ID is stored in entitlement (commercial/entitlements); billing and metering may be plan-based (commercial/billing, metering).

## Plan Structure

| Element | Description |
|---------|-------------|
| **Plan ID** | Unique identifier (e.g., community, developer, professional, enterprise) |
| **Tier** | Mapping to tier (tiers/; api-product/api-tiers) |
| **Quotas** | Request volume, rate limits (api-product/api-quotas) |
| **Rate model** | Rate limit rules (api-product/api-rate-models) |
| **Features** | Feature flags or capability set (org-specific) |
| **Billing** | Subscription, usage-based, or capacity (monetization/; commercial/billing) |

## Plan-to-Tier Mapping

| Plan | Typical tier | Quotas / rate |
|------|--------------|----------------|
| Community | Community | Low; dev/eval |
| Developer | Developer | Medium; dev/test |
| Professional | Professional | Production |
| Enterprise | Enterprise | High or unlimited (contract) |
| Regulated / sovereign | Regulated / sovereign | Contract-based |

## Engine API Alignment

- Engine API (contracts/engine-api, ai-api, optimization-api, trust-api) unchanged; plans apply at gateway.
- No engine logic or API changes; API plans are product and commercial only.

## Certification Readiness

- API plans documented; plan definitions and enforcement are org-specific.
- No engine regression.
