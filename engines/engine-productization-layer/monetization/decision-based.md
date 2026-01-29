# Decision-Based Pricing

## Purpose

Define decision-based monetization for NEXUS-ENGINE: pricing tied to decision or evaluation invocations (engine-intelligence: evaluate, inference, planning). Additive; no change to engine behavior or APIs.

## Principles

- **Decision as unit**: Each decision/evaluation call is metered and optionally billed; aligns with value (e.g., loan decision, fraud decision, recommendation).
- **Metering**: Count of calls to decision endpoints (e.g., /api/Intelligence/evaluate) or equivalent (commercial/metering, usage-tracking).
- **No engine logic change**: Metering at gateway or BFF; engine code and API unchanged.

## Decision Dimensions

| Dimension | Description | Endpoint / component |
|-----------|-------------|------------------------|
| **Evaluate** | Single evaluation/decision call | /api/Intelligence/evaluate |
| **Inference** | Inference call (if exposed) | engine-intelligence/inference |
| **Planning** | Planning call (if exposed) | engine-intelligence/planning |
| **Batch** | Batch of decisions (if supported) | Per batch or per decision in batch |

## Pricing Structure

- **Per decision**: Price per decision/evaluation call.
- **Tiered**: Included decisions in plan; overage billed or blocked (api-product/api-quotas).
- **Hybrid**: Subscription + decision-based overage (monetization/subscription).
- No engine logic or API changes; decision-based pricing is commercial only.

## Commercial Alignment

- Metering (commercial/metering); usage tracking (commercial/usage-tracking); billing (commercial/billing).
- API quotas (api-product/api-quotas); usage license (licensing/usage).
- No engine regression.

## Certification Readiness

- Decision-based pricing documented; metering and billing are org-specific.
- No engine regression.
