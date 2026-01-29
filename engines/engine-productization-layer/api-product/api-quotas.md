# API Quotas

## Purpose

Define API quotas for NEXUS-ENGINE: volume and rate limits applied to API consumption (requests per period, requests per second) per plan or entitlement. Additive; no change to engine behavior or API contracts.

## Principles

- **Quota enforcement at gateway**: Quotas are enforced at API gateway or BFF; requests exceeding quota are rejected (429 or equivalent) before reaching engine; no engine logic change.
- **Plan-based**: Quota values are per plan (api-product/api-plans) or entitlement (commercial/entitlements).
- **Soft vs hard**: Quota may be soft (allow overage, bill) or hard (block); org-specific (commercial/billing, monetization/usage-based).

## Quota Dimensions

| Dimension | Description | Typical unit |
|-----------|-------------|--------------|
| **Request volume** | Total requests per period (day, month) | Per plan (e.g., 10K/day, 1M/month) |
| **Rate** | Requests per second or per minute | Per plan (e.g., 10 req/s, 100 req/min) |
| **Concurrent** | Concurrent requests or connections | Per plan (optional) |
| **Payload** | Request size or response size limit | Per request (gateway) |
| **Endpoint** | Per-endpoint quotas (e.g., /evaluate vs /optimize) | Per plan (optional) |

## Quota Structure

- **Included**: Plan includes N requests/month or M req/s; overage blocked or billed per org.
- **Tiered**: Different quotas per tier (api-product/api-tiers); Community &lt; Developer &lt; Professional &lt; Enterprise.
- **Metering**: Quota consumption is metered (commercial/metering, usage-tracking) for billing and reporting.
- No engine logic or API changes; quotas are gateway/platform only.

## Commercial Alignment

- Entitlements (commercial/entitlements) store quota limits; billing and overage (commercial/billing); usage tracking (commercial/usage-tracking).
- Rate models (api-product/api-rate-models) define rate limit rules.
- No engine regression.

## Certification Readiness

- API quotas documented; quota values and enforcement are org-specific.
- No engine regression.
