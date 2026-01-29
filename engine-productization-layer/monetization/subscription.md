# Subscription Model

## Purpose

Define the subscription monetization model for NEXUS-ENGINE: recurring payment (monthly or annual) for access to the engine (EaaS, library, runtime, platform) with plan-based quotas and support. Additive; no change to engine behavior or APIs.

## Principles

- **Recurring revenue**: Customer pays per period (monthly/annual); access and quotas tied to plan (api-product/api-plans, api-tiers).
- **Plan-based**: Subscription plan defines tier, quotas, support, SLA (tiers/; operations/support-tiers, sla-tiers).
- **No engine logic change**: Billing and subscription are commercial layer; engine code and API unchanged.

## Subscription Characteristics

| Aspect | Description |
|--------|-------------|
| **Billing cycle** | Monthly or annual; prepaid or postpaid per org |
| **Plan** | Plan ID maps to tier, quotas, features (api-product/api-plans; commercial/entitlements) |
| **Overage** | Overage blocked, billed, or allowed per plan (api-product/api-quotas) |
| **Renewal** | Auto-renew or manual; price protection per contract |
| **Upgrade/downgrade** | Plan change; proration or immediate (org-specific) |

## Tier Alignment

| Tier | Subscription typical |
|------|------------------------|
| Community | Free or nominal subscription |
| Developer | Monthly/annual dev plan |
| Professional | Monthly/annual production plan |
| Enterprise | Annual enterprise agreement |
| Regulated / sovereign | Annual contract with compliance terms |

## Commercial Alignment

- Billing (commercial/billing); entitlements (commercial/entitlements); contract enforcement (commercial/contract-enforcement).
- License validation for runtime/library (commercial/license-validation) may tie to active subscription.
- No engine logic or API changes; subscription is commercial only.

## Certification Readiness

- Subscription model documented; billing and plan configuration are org-specific.
- No engine regression.
