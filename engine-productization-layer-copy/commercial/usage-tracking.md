# Usage Tracking

## Purpose

Define usage tracking for NEXUS-ENGINE: collection, storage, and reporting of usage data for billing, quotas, analytics, and customer visibility. Additive; no change to engine behavior or APIs.

## Principles

- **Commercial and operational**: Usage tracking supports billing (commercial/billing), metering (commercial/metering), quota enforcement (api-product/api-quotas), and customer success (operations/customer-success); no engine logic change.
- **Privacy and retention**: Usage data retention and privacy per contract and regulation; org-specific.
- **Enforcement at platform**: Tracking is gateway/platform; engine does not perform usage tracking for billing.

## Usage Tracking Scope

| Aspect | Description |
|--------|-------------|
| **Collection** | Usage events from gateway or platform (commercial/metering) |
| **Dimensions** | API calls, decisions, compute, transactions; per tenant, plan, period |
| **Storage** | Usage records; retention and schema org-specific |
| **Reporting** | Customer-facing usage reports; provider dashboards (operations/ops-tooling, customer-success) |
| **Quota** | Usage vs quota for enforcement (api-product/api-quotas; commercial/entitlements) |
| **Billing** | Usage feeds billing (commercial/billing) |
| **Analytics** | Aggregated analytics for product and growth; org-specific |

## Engine Alignment

- Engine does not perform usage tracking for billing; gateway or platform does. Engine observability (engine-observability) may provide operational metrics separately.
- No engine logic or API changes; usage tracking is commercial only.

## Certification Readiness

- Usage tracking documented; collection, storage, and reporting are org-specific.
- No engine regression.
