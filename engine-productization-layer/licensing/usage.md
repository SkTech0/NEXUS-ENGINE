# Usage License

## Purpose

Define the usage license model for NEXUS-ENGINE: use where the right to use is metered by usage (e.g., API calls, decisions, compute, transactions) rather than by instance or seat. Additive; no change to engine behavior or APIs.

## Principles

- **Usage-based right**: License or plan entitles customer to a volume of usage (calls, decisions, compute units); overage may be blocked or billed (api-product/api-quotas; commercial/metering).
- **Enforcement**: Quotas and rate limits at gateway or platform; metering feeds billing (commercial/usage-tracking, billing).
- **No engine logic change**: Licensing and metering are product and commercial layer; engine code and API unchanged.

## License Characteristics

| Aspect | Usage typical |
|--------|----------------|
| **Use** | EaaS (API) or runtime; usage capped or billed per unit |
| **Metering** | API calls, decisions, optimization runs, compute seconds, etc. (commercial/metering) |
| **Quotas** | Plan-based quota; soft (bill overage) or hard (block) (api-product/api-quotas) |
| **Term** | Subscription (monthly/annual) with usage allowance or pay-as-you-go |
| **Support** | Per plan/tier (operations/support-tiers) |

## Tier and Offering Alignment

- **Community**: Free tier with usage cap (tiers/community).
- **Developer / professional / enterprise**: Usage-based plans with increasing quotas (tiers/; api-product/api-plans).
- **EaaS**: Primary consumption model for usage license (offerings/engine-as-a-service).
- **Monetization**: Usage-based pricing (monetization/usage-based); decision-based or transaction-based (monetization/decision-based, transaction-based).
- No engine logic or API changes; usage license is product and commercial only.

## Commercial Alignment

- Metering, usage tracking, billing, entitlements (commercial/metering, usage-tracking, billing, entitlements).
- Rate models and quotas (api-product/api-rate-models, api-quotas).
- No engine regression.

## Certification Readiness

- Usage license model documented; metering and quotas are org-specific.
- No engine regression.
