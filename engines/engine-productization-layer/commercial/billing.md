# Billing Models

## Purpose

Define billing models for NEXUS-ENGINE: how customers are charged (subscription, usage-based, capacity-based, hybrid) and how billing is executed (invoicing, payment, credits). Additive; no change to engine behavior or APIs.

## Principles

- **Commercial layer**: Billing is gateway/platform and back-office; engine does not perform billing; no engine logic change.
- **Plan and entitlement alignment**: Billing is driven by plan and entitlement (commercial/entitlements; api-product/api-plans); metering feeds usage-based billing (commercial/metering, usage-tracking).
- **Contract alignment**: Billing terms per contract (commercial/contract-enforcement); subscription, usage, capacity per monetization models (monetization/).

## Billing Model Types

| Type | Description | Monetization alignment |
|------|-------------|------------------------|
| **Subscription** | Recurring (monthly/annual); fixed or plan-based | monetization/subscription |
| **Usage-based** | Bill per metered unit (API call, decision, compute) | monetization/usage-based, decision-based, compute-based, transaction-based |
| **Capacity-based** | Bill for reserved capacity (nodes, throughput) | monetization/capacity-based |
| **Hybrid** | Base subscription + usage or capacity overage | monetization/subscription + usage-based or capacity-based |

## Billing Operations

| Aspect | Description |
|--------|-------------|
| **Invoicing** | Monthly, annual, or usage-triggered; per contract |
| **Payment** | Credit card, ACH, invoice; payment terms per contract |
| **Credits** | SLA credits, promotional credits; org-specific |
| **Overage** | Overage billing or block per plan (api-product/api-quotas; commercial/entitlements) |
| **Marketplace** | Billing via cloud marketplace (distribution/cloud-marketplaces) where applicable |
| **Metering** | Metering feeds usage-based billing (commercial/metering, usage-tracking) |

## Engine Alignment

- Engine does not perform billing; metering may capture usage at gateway or platform (commercial/metering).
- No engine logic or API changes; billing is commercial only.

## Certification Readiness

- Billing models documented; invoicing and payment are org-specific.
- No engine regression.
