# Usage-Based Pricing

## Purpose

Define usage-based monetization for NEXUS-ENGINE: pricing tied to metered usage (API calls, decisions, compute, transactions) rather than fixed subscription. Additive; no change to engine behavior or APIs.

## Principles

- **Metered usage**: Usage is measured (commercial/metering, usage-tracking) and billed per unit or tiered bands (commercial/billing).
- **Quotas and overage**: Plan may include included usage; overage billed or blocked (api-product/api-quotas; commercial/entitlements).
- **No engine logic change**: Metering and billing are gateway/platform; engine code and API unchanged.

## Usage Dimensions

| Dimension | Description | Metering |
|-----------|-------------|----------|
| **API calls** | Requests to engine API (e.g., /api/Engine, /api/Intelligence/evaluate) | Per request or per endpoint |
| **Decisions** | Decision/evaluation invocations (engine-intelligence) | Per decision |
| **Optimization runs** | Optimization invocations (engine-optimization) | Per run or per variable |
| **Compute** | CPU/GPU seconds or node-hours (runtime) | Per second or per node-hour |
| **Transactions** | Business transactions (e.g., loan decision, fraud check) | Per transaction (monetization/transaction-based) |

## Pricing Structure

- **Per-unit**: Price per API call, decision, or compute unit.
- **Tiered**: Bands (e.g., first 1M free, then $X per 1K); or graduated tiers.
- **Hybrid**: Base subscription + usage (monetization/subscription + usage-based).
- No engine logic or API changes; pricing is commercial only.

## Commercial Alignment

- Metering (commercial/metering); usage tracking (commercial/usage-tracking); billing (commercial/billing); entitlements (commercial/entitlements).
- API quotas and rate models (api-product/api-quotas, api-rate-models).
- Usage license (licensing/usage).
- No engine regression.

## Certification Readiness

- Usage-based pricing documented; metering and billing are org-specific.
- No engine regression.
