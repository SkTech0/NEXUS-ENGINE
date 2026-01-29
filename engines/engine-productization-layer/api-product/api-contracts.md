# API Contracts

## Purpose

Define API contract productization for NEXUS-ENGINE: how the engine’s API contracts (contracts/engine-api, ai-api, optimization-api, trust-api) are exposed as a product—versioning, stability, and consumer commitments. Additive; no change to engine behavior or API contracts themselves.

## Principles

- **Contract as product commitment**: API contract = commitment to consumers (request/response schema, semantics, stability); engine contracts (contracts/) are source of truth; EPL adds product semantics (versioning, SLA, compatibility).
- **No contract modification**: EPL does not change OpenAPI or engine behavior; productization is documentation, versioning policy, and governance (governance/compatibility-policy, deprecation-policy).
- **Consumer alignment**: Contracts are versioned and documented for SDK generation, testing, and compliance (packaging/sdk-bundles; api-product/api-governance).

## Contract Scope

| Contract | Scope | Product use |
|----------|--------|-------------|
| **engine-api** | Health, Engine, Intelligence, Optimization, AI, Trust | Core API product; plans and quotas apply (api-product/api-plans, api-quotas) |
| **ai-api** | AI-specific endpoints | Optional separate plan or bundle (packaging/api-bundles) |
| **optimization-api** | Optimization endpoints | Optional separate plan or bundle |
| **trust-api** | Trust, audit, compliance | Optional separate plan or bundle |

## Product Semantics

- **Versioning**: API version in path (e.g., /v1/) or header; semver for contract changes (governance/compatibility-policy).
- **Stability**: Commitment to backward compatibility per policy (governance/compatibility-policy); deprecation timeline (governance/deprecation-policy).
- **Documentation**: OpenAPI export, versioned; public or gated per tier (api-product/api-tiers).
- No engine logic or API contract changes; API contracts productization is documentation and governance only.

## Certification Readiness

- API contract productization documented; versioning and stability are org-specific.
- No engine regression.
