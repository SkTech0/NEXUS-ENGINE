# RBAC Model

## Purpose

Define the RBAC (role-based access control) model for NEXUS-ENGINE: roles and permissions for engine access. Additive; no change to engine behavior.

## Principles

- Engine does not implement RBAC; platform or API gateway enforces roles and permissions.
- Roles and permissions are defined at enterprise level; engine is a resource to be protected.
- RBAC supports least privilege and segregation of duties (see governance/access-governance).

## Model (Example)

| Role | Permissions |
|------|-------------|
| Engine user | Call inference/query APIs within scope and rate limits. |
| Engine operator | Configure, deploy model, view metrics and logs. |
| Engine admin | Full config, override, recovery; audit of admin actions. |
| Auditor | Read-only access to audit logs and evidence. |
| Data owner | Define data scope and retention for engine use. |

## Engine Support

- Engine does not enforce RBAC; it accepts requests that platform has authorized.
- Audit events include actor and action; RBAC decisions are logged at platform.
- No engine logic or API changes required.

## Certification Readiness

- RBAC model documented; roles and permissions are enterprise-specific.
- No engine logic or API changes required.
