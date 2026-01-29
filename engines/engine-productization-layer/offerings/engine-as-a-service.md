# Engine-as-a-Service (EaaS)

## Purpose

Define the engine-as-a-service offering: NEXUS-ENGINE consumed as a hosted API with no artifact delivery to the customer. The provider operates the engine; the customer integrates via API only. Additive; no change to engine behavior or API contracts.

## Principles

- **API-only consumption**: Customer receives no engine binary, container, or library; only API endpoint(s), credentials, and documentation (packaging/api-bundles, sdk-bundles for client).
- **Provider-operated**: Hosting, scaling, upgrades, DR, and monitoring are provider responsibility (operations/managed-engine, hosted-engine).
- **Commercial alignment**: Subscription, usage-based, or capacity pricing (monetization/); SLA and support per tier (operations/sla-tiers, support-tiers); billing and metering (commercial/billing, metering).

## Offering Characteristics

| Aspect | Description |
|--------|-------------|
| **Consumption** | API-only; authentication and authorization at gateway |
| **Tenancy** | Shared (multi-tenant) or dedicated per tier (tiers/) |
| **Operations** | Provider-managed; upgrades, scaling, DR (operations/managed-engine) |
| **Billing** | Subscription and/or usage-based (commercial/billing, monetization/) |
| **SLA** | Per tier (operations/sla-tiers) |
| **Data residency** | Per tier and region (tiers/enterprise, regulated, sovereign) |

## API Product Alignment

- API plans, tiers, quotas, and rate models apply to EaaS (api-product/api-plans, api-tiers, api-quotas, api-rate-models).
- Entitlements and license validation for EaaS are subscription/plan-based, not runtime license (commercial/entitlements, license-validation).
- No engine logic or API changes; EaaS is an offering model, not a code change.

## Tier Mapping

| Tier | EaaS typical |
|------|---------------|
| Community | Free or low-quota shared tenant |
| Developer | Shared tenant; dev/test quotas |
| Professional | Shared or dedicated; production quotas |
| Enterprise | Dedicated; custom SLA; data residency |
| Regulated | Dedicated; compliance controls; audit |
| Sovereign | Dedicated; sovereign cloud; data sovereignty |

## Certification Readiness

- EaaS offering documented; implementation is platform and commercial ops.
- No engine regression.
