# Sovereign Edition

## Purpose

Define the sovereign edition tier for NEXUS-ENGINE: access for organizations requiring full data sovereignty and/or sovereign cloud deployment (government, defense, national critical infrastructure). Additive; no change to engine behavior or APIs.

## Principles

- **Data sovereignty**: Data and metadata remain in sovereign jurisdiction; no cross-border transfer unless explicitly agreed (distribution/sovereign-cloud).
- **Sovereign cloud**: Deployment on sovereign cloud or on-prem in jurisdiction; no dependency on non-sovereign hyperscalers for critical path (distribution/sovereign-cloud).
- **Control and audit**: Full control over deployment, upgrades, and access; audit and compliance per jurisdiction (governance/; engine-certification-layer).

## Tier Characteristics

| Aspect | Sovereign typical |
|--------|--------------------|
| **License** | Enterprise or sovereign license (licensing/enterprise) |
| **Consumption** | Runtime, library; EaaS only if hosted in sovereign cloud (offerings/) |
| **Quotas** | Contract-based (api-product/) |
| **Support** | Dedicated; sovereign-aware; optional on-prem support (operations/support-tiers) |
| **SLA** | Contractual; aligned with sovereign requirements (operations/sla-tiers) |
| **Tenancy** | Dedicated; sovereign cloud or on-prem in jurisdiction |
| **Data residency** | Data and metadata in sovereign jurisdiction only |
| **Infrastructure** | Sovereign cloud or accredited on-prem (distribution/sovereign-cloud) |
| **Distribution** | Air-gapped; signed; sovereign-approved supply chain (distribution/air-gapped) |

## Packaging and Distribution

- **Runtime / container**: Signed, air-gapped bundle; sovereign cloud or on-prem only (packaging/, distribution/air-gapped, sovereign-cloud).
- **No public cloud (non-sovereign)**: Sovereign edition does not rely on public hyperscaler regions outside jurisdiction unless sovereign cloud partnership.
- No engine logic or API changes; sovereign tier is product, distribution, and commercial configuration only.

## Certification and Compliance Alignment

- engine-certification-layer and governance feed into sovereign readiness.
- Sovereign edition documented; jurisdiction and accreditation are org and country-specific.
- No engine regression.

## Certification Readiness

- Sovereign tier documented; sovereign cloud and data sovereignty are org and jurisdiction-specific.
- No engine regression.
