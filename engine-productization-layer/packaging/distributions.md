# Engine Distributions

## Purpose

Define engine distributions for NEXUS-ENGINE: how the engine is packaged and delivered as distributable artifacts for sellable, licensable, and deployable consumption. Additive; no change to engine behavior, APIs, or business logic.

## Principles

- **Engine-first productization**: All distributions are built from the same engine core (engine-core, engine-api, engine-intelligence, engine-trust, engine-optimization); no fork or divergent logic.
- **Single source of truth**: One build pipeline produces multiple distribution types; versioning and compatibility are governed (see governance/compatibility-policy, deprecation-policy).
- **Consumer-aligned**: Distribution type matches consumption model—runtime for self-hosted, library for embeddable, container for cloud/Kubernetes, API for SaaS, SDK for integrators.

## Distribution Types

| Type | Artifact | Consumer | Delivery |
|------|----------|----------|----------|
| **Runtime distribution** | Engine runtime + dependencies; runnable process (binary or script) | Self-hosted, on-prem, edge | Tarball, package manager, installer |
| **Library distribution** | Engine as library (npm, PyPI, NuGet, etc.); embeddable | Developers, embedded use, ISVs | npm, PyPI, Maven, NuGet |
| **Container distribution** | Engine as OCI image; deployable | Cloud, Kubernetes, air-gapped | Registry (public/private), artifact store |
| **API distribution** | Engine behind API gateway; no artifact to customer | API consumers, SaaS | Hosted endpoint; no binary |
| **SDK distribution** | Client SDKs + docs; no engine binary | Integrators, app developers | npm, PyPI, package managers |

## Versioning and Signing

- **Semantic versioning**: Distributions follow semver; compatibility and deprecation are documented (governance/deprecation-policy, compatibility-policy).
- **Artifact integrity**: Checksums (SHA-256) and optional code signing; supply-chain integrity documented for enterprise and regulated tiers.
- **Build provenance**: Build pipeline produces reproducible artifacts where feasible; no engine logic or API changes—distribution is packaging and delivery only.

## Tier and Offering Mapping

| Distribution | Typical tiers | Offering alignment |
|--------------|---------------|-------------------|
| Runtime | Developer, professional, enterprise, regulated, sovereign | engine-as-a-runtime, on-prem, air-gapped |
| Library | Community, developer, professional, embedded license | engine-as-a-library, engine-as-a-module |
| Container | Professional, enterprise, regulated, sovereign | engine-as-a-runtime, cloud, edge |
| API | All tiers (plan-dependent) | engine-as-a-service |
| SDK | All tiers (plan-dependent) | engine-as-a-service, engine-as-a-platform |

## Certification Readiness

- Distribution model documented; build and release are pipeline and org-specific.
- No engine regression; distributions are packaging layers only.
- Regulated and sovereign tiers may require signed, audited build and distribution (see tiers/regulated, tiers/sovereign).
