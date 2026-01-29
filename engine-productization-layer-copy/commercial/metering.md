# Metering Models

## Purpose

Define metering models for NEXUS-ENGINE: how usage is measured (API calls, decisions, compute, transactions) for billing, quotas, and reporting. Additive; no change to engine behavior or APIs.

## Principles

- **Metering at gateway/platform**: Usage is measured at API gateway, BFF, or orchestration layer; engine may expose metrics (engine-observability) but billing metering is external; no engine logic change.
- **Plan and entitlement alignment**: Metering feeds quotas (api-product/api-quotas), billing (commercial/billing), and usage tracking (commercial/usage-tracking).
- **Dimensions**: Metering dimensions align with monetization (monetization/usage-based, decision-based, compute-based, transaction-based).

## Metering Dimensions

| Dimension | Description | Typical unit |
|-----------|-------------|--------------|
| **API calls** | Requests to engine API | Per request or per endpoint |
| **Decisions** | Decision/evaluation invocations | Per decision |
| **Optimization runs** | Optimization invocations | Per run |
| **Compute** | vCPU-seconds, GB-hours, node-hours | Per unit |
| **Transactions** | Business transactions (loan, fraud, etc.) | Per transaction |

## Metering Operations

| Aspect | Description |
|--------|-------------|
| **Collection** | Gateway or platform collects usage; optional engine metrics (engine-observability) for health, not billing |
| **Aggregation** | Per tenant, per plan, per period; org-specific |
| **Storage** | Usage records stored for billing and reporting; retention per contract |
| **Quota enforcement** | Metering feeds quota check (api-product/api-quotas); overage block or bill (commercial/billing) |
| **Billing** | Metering feeds usage-based billing (commercial/billing) |
| **Reporting** | Usage reports for customer and provider (commercial/usage-tracking) |

## Engine Alignment

- Engine does not perform billing metering; gateway or platform does. Engine may expose metrics for observability only.
- No engine logic or API changes; metering is commercial only.

## Certification Readiness

- Metering models documented; collection and aggregation are org-specific.
- No engine regression.
