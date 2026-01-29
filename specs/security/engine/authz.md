# Engine Authorization

**Status:** Standard  
**Owner:** Platform Architecture / Security  
**Classification:** Security — Engine Authz  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS enforces authorization: who (or what) may perform which action on which resource. Authorization is applied after authentication and is required for multi-tenant and commercial deployment.

---

## 2. Authorization Model

### 2.1 Resource Hierarchy

- **Platform:** APIs, engines, and configuration.
- **Tenant:** Tenant-scoped resources (e.g., data, decisions, config per tenant).
- **Resource types:** Decisions, datasets, engines, jobs, and admin operations.

### 2.2 Actions

- **Read:** Access to data, decisions, lineage, or config.
- **Execute:** Invoke an engine or API.
- **Write:** Create or update data, config, or resources.
- **Admin:** Lifecycle, configuration, or security-sensitive operations.

### 2.3 Principals

- **User:** Human identity (e.g., OIDC subject).
- **Tenant:** Tenant identity (e.g., organization ID).
- **Engine/Service:** Engine or service identity (see identity.md).
- **System:** Automated or internal actor; MUST have explicit permissions.

---

## 3. Policy Enforcement

- **Where:** Authorization MUST be enforced at the API edge and at engine boundaries (e.g., before executing an engine on behalf of a tenant).
- **When:** Every request that accesses a protected resource MUST be checked; default is deny.
- **Policy store:** Policies MAY be stored in a dedicated policy engine (e.g., RBAC, ABAC, or Rego); policy format and evaluation MUST be documented.

---

## 4. Capability-Based Security

- **Principle:** Access MAY be expressed as capabilities (e.g., “can execute engine X for tenant Y”) rather than only roles; capabilities MAY be short-lived (e.g., scoped tokens).
- **Least privilege:** Principals MUST be granted the minimum permissions required; engine-to-engine calls MUST use service identity with minimal scope.
- **Tenant isolation:** Tenant A MUST NOT access tenant B’s data or resources unless explicitly shared or governed by policy.

---

## 5. Audit

- Authorization decisions (allow/deny) SHOULD be logged for sensitive resources; denials MUST be logged with principal, resource, action, and timestamp.
- Logs MUST be access-controlled and retained per compliance policy.

---

## 6. References

- [identity.md](./identity.md)
- [auth.md](./auth.md)
- [trust-model.md](./trust-model.md)
- [policy.md](./policy.md)
- [zero-trust.md](./zero-trust.md)
