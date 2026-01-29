# Entitlement Systems

## Purpose

Define entitlement systems for NEXUS-ENGINE: what each customer or tenant is entitled to (plans, quotas, features, optional license). Additive; no change to engine behavior.

## Principles

- **Entitlement = record**: Customer/tenant plan, quotas, feature flags, optional license; enforced at gateway or platform (api-product/api-plans, api-quotas).
- **Enforcement at gateway/platform**: Entitlements drive access, rate limits, and billing; engine does not enforce entitlements; no engine logic change.
- **Update on change**: Entitlements updated on subscription change, plan change, or license activation (commercial/license-validation).

## Entitlement Contents

| Element | Description |
|---------|-------------|
| **Plan** | Plan or tier ID (api-product/api-plans, api-tiers) |
| **Quotas** | Volume and rate limits (api-product/api-quotas, api-rate-models) |
| **Features** | Feature flags or capability set (org-specific) |
| **License** | Optional; license key or reference for runtime/embedded (commercial/license-validation) |
| **Expiry** | Optional; subscription or license expiry |
| **Capacity** | Optional; reserved nodes, throughput (monetization/capacity-based) |

## Commercial Alignment

- Billing, metering, usage tracking (commercial/billing, metering, usage-tracking); contract enforcement (commercial/contract-enforcement).
- API plans and quotas (api-product/) define entitlement values; gateway enforces.
- No engine logic or API changes; entitlements are commercial ops and gateway config.

## Certification Readiness

- Entitlement system documented; schema and enforcement are org-specific.
- No engine regression.
