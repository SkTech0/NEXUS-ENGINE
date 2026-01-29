# API Rate Models

## Purpose

Define API rate models for NEXUS-ENGINE: rate limit rules (requests per second, per minute, burst) applied to API consumption per plan or entitlement. Additive; no change to engine behavior or API contracts.

## Principles

- **Rate enforcement at gateway**: Rate limits are enforced at API gateway or BFF (token bucket, sliding window, or fixed window); engine receives traffic that has already passed rate check; no engine logic change.
- **Plan-based**: Rate limits are per plan (api-product/api-plans) or entitlement (commercial/entitlements).
- **Quota alignment**: Rate model complements volume quota (api-product/api-quotas); together they define throughput and volume limits.

## Rate Model Types

| Type | Description | Use case |
|------|-------------|----------|
| **Fixed window** | N requests per fixed window (e.g., 100/min) | Simple, predictable |
| **Sliding window** | N requests per sliding window | Smoother burst handling |
| **Token bucket** | Burst + sustained rate (tokens/sec, bucket size) | Burst-tolerant |
| **Per-endpoint** | Different rate per path (e.g., /evaluate vs /optimize) | Fine-grained |

## Rate Dimensions

| Dimension | Description | Typical unit |
|-----------|-------------|--------------|
| **Requests per second** | Sustained RPS limit | Per plan (e.g., 10 RPS) |
| **Requests per minute** | Per-minute limit | Per plan (e.g., 600/min) |
| **Burst** | Short burst allowance | Per plan (e.g., 50 in 1s) |
| **Concurrent** | Concurrent request limit | Per plan (optional) |

## API Product Alignment

- Rate model is part of plan (api-product/api-plans); quotas (api-product/api-quotas) define volume.
- Governance (api-product/api-governance) may define rate limit policy (e.g., fairness, abuse prevention).
- No engine logic or API changes; rate models are gateway/platform only.

## Certification Readiness

- API rate models documented; rate values and enforcement are org-specific.
- No engine regression.
