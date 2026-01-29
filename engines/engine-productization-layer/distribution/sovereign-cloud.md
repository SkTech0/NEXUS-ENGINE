# Sovereign Cloud Distribution

## Purpose

Define sovereign cloud distribution for NEXUS-ENGINE: delivery and operation of the engine in sovereign cloud or sovereign jurisdiction (government cloud, national cloud, or accredited in-country infrastructure). Additive; no change to engine behavior or APIs.

## Principles

- **Data sovereignty**: Data and metadata remain in sovereign jurisdiction; no cross-border transfer unless explicitly agreed; compliance with local regulation.
- **Sovereign infrastructure**: Engine runs on sovereign cloud (e.g., government cloud, national cloud) or accredited on-prem in jurisdiction; no dependency on non-sovereign hyperscaler for critical path.
- **Control and audit**: Full control over deployment, upgrades, and access; audit and compliance per jurisdiction (governance/; engine-certification-layer).

## Distribution and Deployment

| Aspect | Description |
|--------|-------------|
| **Infrastructure** | Sovereign cloud region or accredited on-prem in jurisdiction |
| **Artifacts** | Signed, air-gapped option; private registry in jurisdiction (packaging/; distribution/air-gapped) |
| **EaaS** | If EaaS, hosted only in sovereign cloud; no cross-border tenant data (offerings/engine-as-a-service; tiers/sovereign) |
| **License** | Enterprise or sovereign license (licensing/enterprise) |

## Tier Alignment

- **Sovereign edition**: Primary tier for sovereign cloud (tiers/sovereign).
- **Regulated**: May use sovereign cloud for regulated data (tiers/regulated).
- **Enterprise**: Sovereign option for data residency (tiers/enterprise).
- No engine logic or API changes; sovereign cloud is distribution and commercial only.

## Certification Readiness

- Sovereign cloud distribution documented; jurisdiction and accreditation are org and country-specific.
- No engine regression.
