# IAM Integration

## Purpose

Define IAM (identity and access management) integration for NEXUS-ENGINE: how the engine integrates with enterprise identity. Additive; no change to engine behavior.

## Principles

- Engine does not implement authentication or identity; it trusts the platform or API gateway.
- All API access is authenticated; identity is passed to engine for audit and authorization checks at gateway.
- IAM integration supports SSO, MFA, and RBAC (see sso-integration, rbac-model).

## Integration Points

| Point | Description |
|-------|-------------|
| API gateway | Authenticates request; passes identity (e.g., subject, roles) to engine or platform. |
| Engine | Uses identity for audit (actor in audit events); does not make allow/deny decisions. |
| Admin / config | Admin operations require elevated identity and audit. |

## Engine Support

- Engine accepts authenticated requests; actor (identity) is included in every audit event.
- Engine does not store or validate credentials; platform enforces IAM.
- No engine logic or API changes required; integration is at platform layer.

## Certification Readiness

- IAM integration documented; implementation is enterprise-specific.
- No engine logic or API changes required.
