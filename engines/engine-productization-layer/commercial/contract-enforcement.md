# Contract Enforcement

## Purpose

Define contract enforcement for NEXUS-ENGINE: how commercial terms (plan, quota, SLA, license, payment) are enforced and how breaches or disputes are handled. Additive; no change to engine behavior or APIs.

## Principles

- **Commercial and legal**: Contract enforcement is process, platform, and legal; engine does not enforce contracts; no engine logic change.
- **Enforcement mechanisms**: Quota and rate limits (api-product/api-quotas, api-rate-models), entitlement checks (commercial/entitlements), license validation (commercial/license-validation), billing and payment (commercial/billing).
- **Breach and dispute**: Process for breach (e.g., non-payment, overuse), dispute resolution, and remedies; org-specific.

## Enforcement Mechanisms

| Mechanism | Description |
|-----------|-------------|
| **Quota** | Gateway blocks or bills over quota (api-product/api-quotas; commercial/entitlements) |
| **Rate limit** | Gateway enforces rate (api-product/api-rate-models) |
| **License** | Launcher or platform validates license (commercial/license-validation) |
| **Payment** | Non-payment may suspend access per contract; billing (commercial/billing) |
| **SLA** | SLA measured and reported; credits or remedies per contract (operations/sla-tiers) |
| **Terms** | Legal terms (use, data, compliance); enforcement is legal and process |

## Contract Scope

| Aspect | Description |
|--------|-------------|
| **Plan** | Plan and tier (api-product/api-plans, api-tiers); entitlement (commercial/entitlements) |
| **Quota / rate** | Enforced at gateway (api-product/) |
| **License** | Enforced at startup or platform (commercial/license-validation) |
| **Payment** | Billing and payment terms (commercial/billing) |
| **SLA** | Uptime and remedies (operations/sla-tiers) |
| **Data / compliance** | Data residency, compliance; contractual and legal |

## Engine Alignment

- Engine does not enforce contracts; gateway, platform, and back-office do.
- No engine logic or API changes; contract enforcement is commercial only.

## Certification Readiness

- Contract enforcement documented; breach and dispute process are org-specific.
- No engine regression.
