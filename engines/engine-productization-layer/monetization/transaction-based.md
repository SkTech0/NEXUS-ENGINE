# Transaction-Based Pricing

## Purpose

Define transaction-based monetization for NEXUS-ENGINE: pricing tied to business transactions (e.g., loan application, fraud check, optimization job) that the engine supports. Additive; no change to engine behavior or APIs.

## Principles

- **Transaction as unit**: One business transaction (e.g., one loan decision, one fraud screening) = one billable unit; value-aligned pricing.
- **Metering**: Transaction count inferred from API calls or explicit transaction API (commercial/metering, usage-tracking); mapping is product/org-specific.
- **No engine logic change**: Metering and billing are commercial layer; engine code and API unchanged.

## Transaction Mapping

| Transaction type | Engine involvement | Metering |
|------------------|--------------------|----------|
| **Loan decision** | /api/Intelligence/evaluate or Engine execute | Per application or per decision |
| **Fraud check** | Trust + Intelligence | Per check |
| **Optimization job** | /api/Optimization/optimize | Per job or per variable |
| **AI completion** | /api/AI or equivalent | Per request or per token (org-specific) |
| **Custom** | Engine API calls | Per transaction (org-defined) |

## Pricing Structure

- **Per transaction**: Price per business transaction.
- **Tiered**: Included transactions in plan; overage billed (api-product/api-quotas; commercial/entitlements).
- **Hybrid**: Subscription + transaction overage; or usage-based (monetization/subscription, usage-based).
- No engine logic or API changes; transaction pricing is commercial only.

## Commercial Alignment

- Metering (commercial/metering); usage tracking (commercial/usage-tracking); billing (commercial/billing).
- Transaction pricing may align with decision-based (monetization/decision-based) or usage-based (monetization/usage-based).
- No engine regression.

## Certification Readiness

- Transaction-based pricing documented; transaction definition and metering are org-specific.
- No engine regression.
