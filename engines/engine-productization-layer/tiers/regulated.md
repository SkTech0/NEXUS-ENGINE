# Regulated Edition

## Purpose

Define the regulated edition tier for NEXUS-ENGINE: access for organizations in regulated industries (financial services, healthcare, government) with enhanced compliance, audit, and distribution controls. Additive; no change to engine behavior or APIs.

## Principles

- **Compliance-first**: Regulated tier aligns with industry and jurisdictional requirements; evidence and audit trail (engine-certification-layer, governance/).
- **Controlled distribution**: Signed artifacts, air-gapped delivery option, private registry (packaging/, distribution/air-gapped).
- **Audit and governance**: Audit logs, compliance evidence, lifecycle and deprecation policy (governance/lifecycle-management, deprecation-policy; engine-certification-layer).

## Tier Characteristics

| Aspect | Regulated typical |
|--------|--------------------|
| **License** | Enterprise or regulated license (licensing/enterprise) |
| **Consumption** | API (EaaS dedicated), runtime, library; full control over deployment (offerings/) |
| **Quotas** | Contract-based; rate limits per agreement (api-product/) |
| **Support** | Dedicated support; compliance-aware (operations/support-tiers) |
| **SLA** | 99.9% or higher; contractual (operations/sla-tiers) |
| **Tenancy** | Dedicated; isolated; no shared tenancy for regulated data |
| **Data residency** | Explicit region/country; compliance with local regulation |
| **Audit** | Audit logs, supply-chain evidence, compliance pipeline (engine-certification-layer) |
| **Distribution** | Signed bundles; air-gapped; private registry (distribution/air-gapped) |

## Packaging and Distribution

- **Runtime / container**: Signed images and bundles; checksums and provenance (packaging/runtime-bundles, container-bundles).
- **Air-gapped**: Offline install package (distribution/air-gapped).
- **On-prem**: Preferred for regulated data (distribution/on-prem).
- No engine logic or API changes; regulated tier is product, compliance, and distribution configuration only.

## Certification and Compliance Alignment

- engine-certification-layer (compliance, audit, legal, safety) feeds into regulated tier readiness.
- Regulated edition documented; compliance scope and evidence are org and jurisdiction-specific.
- No engine regression.

## Certification Readiness

- Regulated tier documented; compliance and distribution controls are org-specific.
- No engine regression.
