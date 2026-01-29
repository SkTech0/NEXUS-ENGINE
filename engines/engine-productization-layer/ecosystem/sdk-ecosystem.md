# SDK Ecosystem

## Purpose

Define the SDK ecosystem for NEXUS-ENGINE: first-party and optional third-party client SDKs, language coverage, versioning, and ecosystem governance. Additive; no change to engine behavior or API contracts.

## Principles

- **API-faithful**: SDKs wrap engine API (contracts/); no new server behavior; client-only (packaging/sdk-bundles).
- **Multi-language**: First-party SDKs for major languages (TypeScript/JavaScript, Python, .NET); optional community or partner SDKs for other languages.
- **Versioned**: SDK version aligns with API version; compatibility and deprecation documented (governance/compatibility-policy, deprecation-policy).

## First-Party SDKs

| Language | Package | Delivery |
|----------|---------|----------|
| TypeScript/JavaScript | npm | packaging/sdk-bundles |
| Python | PyPI | packaging/sdk-bundles |
| .NET | NuGet | packaging/sdk-bundles |

## Ecosystem Scope

| Aspect | Description |
|--------|-------------|
| **Client library** | Typed client, auth, retries, transport (packaging/sdk-bundles) |
| **Generated types** | From OpenAPI or hand-maintained |
| **Documentation** | API reference, getting started, examples |
| **Optional: third-party** | Community or partner SDKs; compatibility program (governance/compatibility-policy) |
| **Optional: CLI** | Command-line tool (org-specific) |

## Platform and Offering Alignment

- SDK ecosystem is core to engine-as-a-platform (offerings/engine-as-a-platform); EaaS and API consumption (offerings/engine-as-a-service) rely on SDK for integration.
- API plans and quotas apply to usage via SDK (api-product/api-plans, api-quotas).
- No engine logic or API changes; SDK ecosystem is packaging and ecosystem only.

## Certification Readiness

- SDK ecosystem documented; first-party and third-party scope are org-specific.
- No engine regression.
