# SDK Bundles

## Purpose

Define SDK bundles for NEXUS-ENGINE: client SDKs and companion artifacts that allow integrators and application developers to consume the engine API in a language- and framework-native way. Additive; no change to engine behavior or API contracts.

## Principles

- **API-faithful**: SDKs wrap the engine API (contracts/); no new server behavior; client-only code generation or hand-maintained clients.
- **Multi-language**: At least one SDK per major ecosystem (e.g., TypeScript/JavaScript, Python, .NET); packaging per language (npm, PyPI, NuGet).
- **Versioned**: SDK version aligns with API version; compatibility and deprecation documented (governance/compatibility-policy, deprecation-policy).

## Bundle Contents

| Component | Description |
|-----------|-------------|
| **Client library** | Typed client for engine endpoints; auth (API key, OAuth) and transport (HTTP, retries) |
| **Generated types** | Request/response types from OpenAPI or hand-maintained |
| **Documentation** | API reference, getting started, examples; versioned with SDK |
| **Optional: CLI** | Command-line tool for ad-hoc calls or scripting (org-specific) |

## Packaging and Distribution

| Language | Package manager | Artifact |
|----------|-----------------|----------|
| TypeScript/JavaScript | npm | `@nexus/engine-client` (or org-specific scope) |
| Python | PyPI | `nexus-engine-client` |
| .NET | NuGet | `Nexus.Engine.Client` |

- SDK bundles are versioned; optional compatibility matrix (e.g., SDK 2.x supports API 2.x).
- No engine logic or API changes; SDK is client-side only.

## Ecosystem Alignment

- SDK is the foundation for ecosystem/sdk-ecosystem; plugins or extensions may depend on SDK (ecosystem/plugin-ecosystem, extension-ecosystem).
- Marketplace or partner offerings may ship additional SDKs or wrappers (ecosystem/marketplace-ecosystem).

## Tier and Offering Alignment

- **EaaS / platform**: SDK bundles are core deliverable; available to all tiers with plan-based rate limits (api-product/api-quotas).
- **Developer / professional / enterprise**: Same SDK artifact; entitlement and rate limits applied at API gateway.

## Certification Readiness

- SDK bundle spec documented; build and publish are org-specific.
- No engine regression.
