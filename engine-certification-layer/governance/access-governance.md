# Access Governance

## Purpose

Define access governance for NEXUS-ENGINE: who may access what, under which conditions, with which audit. Additive; no change to engine behavior.

## Principles

- Least privilege: access granted only as needed for role.
- Segregation of duties: critical actions require separation (e.g., config vs. approve).
- Audit of access: all access and privileged actions logged (see audit).
- Integration with enterprise IAM: SSO, RBAC (see enterprise).

## Access Types

| Type | Scope | Governance |
|------|--------|------------|
| API access | Engine APIs for inference, query, admin | IAM, RBAC, rate limits |
| Admin access | Configuration, model deployment, overrides | Elevated RBAC, audit |
| Data access | Data ingested or produced by engine | Data governance, retention |
| Operational access | Logs, metrics, recovery | Operations, audit |

## RBAC Alignment

- Roles and permissions defined at platform/enterprise layer (see enterprise/rbac-model).
- Engine does not implement authentication or authorization; it trusts platform/API gateway.
- Engine emits audit events for every authenticated request and significant action.

## Certification Readiness

- Access governance documented; implementation is IAM/RBAC and deployment-specific.
- No engine logic or API changes required.
