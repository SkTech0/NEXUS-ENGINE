# API Explainability Contract

## Definition

The **API explainability contract** defines the programmatic interface for requesting and receiving explanations. It is binding for EEL API implementation; engine and ECOL are unchanged. This document is conceptual; actual API shape (REST, gRPC, event) is implementation-defined.

## Request

- **Inputs** (required): trace_id, target_ref, target_type (or inferred from target_ref), locale (optional, default en-US), audience (optional, default human).
- **Inputs** (optional): explanation_id (for retrieval of existing explanation), include_breakdown (boolean, for contribution/reasoning detail level).
- **Validation**: trace_id and target_ref MUST resolve to an existing ECOL trace and entity; otherwise 404.

## Response

- **Success**: HTTP 200 (or equivalent); body = explanation payload (JSON) conforming to explanation-schema.json and type-specific schema. Headers: Content-Type application/json; charset=utf-8; X-Explanation-Id, X-Trace-Id, X-Generated-At optional.
- **Not found**: 404 when no explanation can be produced (e.g. trace_id or target_ref unknown, or explanation not yet generated).
- **Error**: 4xx/5xx with structured error body (error code, message); no engine or ECOL state changed.

## Idempotency

- Same request (trace_id, target_ref, locale, audience) SHOULD return the same explanation structure; explanation_id MAY be stable (cached) or newly generated per policy. Implementation MAY support If-None-Match or similar for cache reuse.

## Rate and Quotas

- Rate limits and quotas are implementation or platform concerns; EEL contract does not specify limits. API implementation MAY rate-limit per trace_id, target_ref, or tenant.

## Versioning

- API version in URL or header (e.g. /v1/explanations); schema version in payload ($schema or version field) for forward compatibility. Breaking changes require new API version; EEL schemas are versioned (schemas/*.json $id or version).

## Contract

- EEL API implementation MUST accept request as above and return response as above; engine and ECOL are not modified.
- Clients MAY rely on schema compliance and traceability fields for integration; determinism and completeness per explanation-contract and audience-specific contracts.
