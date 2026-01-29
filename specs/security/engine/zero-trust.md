# Zero-Trust Design for Engine Platform

**Status:** Standard  
**Owner:** Platform Architecture / Security  
**Classification:** Security — Zero Trust  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS applies zero-trust principles: never trust by default, verify explicitly, and assume breach. Zero-trust design is required for enterprise and commercial deployment.

---

## 2. Principles

### 2.1 Never Trust, Always Verify

- **No implicit trust by location:** Access is not granted solely because the request comes from the internal network; identity and authorization are verified for every request.
- **Every request:** Authentication and authorization apply to API calls, engine-to-engine calls, and admin operations; no “trusted internal only” bypass without explicit policy and audit.

### 2.2 Least Privilege

- **Minimal permissions:** Principals (users, services, engines) receive only the permissions they need; permissions are scoped to tenant, resource, and action.
- **Short-lived credentials:** Where possible, tokens and credentials have short TTL; refresh is required for continued access.
- **Just-in-time access:** Elevated or sensitive access MAY be time-bound and approved (e.g., break-glass).

### 2.3 Assume Breach

- **Segmentation:** Compromise of one component MUST NOT automatically grant access to others; network and identity boundaries limit lateral movement.
- **Encryption:** Data in transit and at rest (where required by policy) to limit impact of compromise.
- **Audit and detection:** Security-relevant events (auth, authz, data access) are logged and monitored; anomalies trigger alerts.

---

## 3. Application to NEXUS

### 3.1 API Edge

- All API traffic is authenticated; authorization is enforced per resource and tenant.
- TLS for all external and (where policy requires) internal traffic.
- Rate limiting and input validation at the edge.

### 3.2 Engine-to-Engine

- Calls between engines or services use strong identity (e.g., mTLS or JWT); no anonymous internal calls.
- Authorization checks: caller identity is checked against policy (e.g., “engine A may call engine B for tenant T”).

### 3.3 Data Access

- Engines and services access data stores with credentials scoped to the minimum required data; tenant data is isolated by tenant ID and policy.
- Access to sensitive data (e.g., PII, decisions) is logged and optionally masked in logs.

### 3.4 Operational Access

- Operator and CI access to production use MFA and role-based access; actions are audited.
- Secrets are not stored in code or config repos; they are fetched from a secrets manager at runtime.

---

## 4. References

- [identity.md](./identity.md)
- [auth.md](./auth.md)
- [authz.md](./authz.md)
- [trust-model.md](./trust-model.md)
- [policy.md](./policy.md)
