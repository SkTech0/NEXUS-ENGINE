# Engine Identity Model

**Status:** Standard  
**Owner:** Platform Architecture / Security  
**Classification:** Security — Engine Identity  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS engines are identified and how identity is asserted in the platform. Engine identity is the foundation for authentication, authorization, and audit.

---

## 2. Identity Entities

### 2.1 Engine Instance Identity

- **Definition:** A unique, stable identity for each engine instance (or engine type in single-instance deployments).
- **Representation:** Engine name (from engine contract) plus instance ID (e.g., hostname, pod ID, or UUID) where multiple instances exist.
- **Stability:** Identity MUST remain stable for the lifetime of the instance; MUST be usable in logs, metrics, and audit.

### 2.2 Service / Component Identity

- **Definition:** Identity used when an engine or service calls another (e.g., service account, API key, or mTLS certificate).
- **Representation:** MUST be machine-readable and verifiable (e.g., JWT, certificate subject, or API key ID).
- **Scope:** Per deployment, per tenant, or per component as defined by policy.

---

## 3. Identity Assertion

- **In-process:** Engine identity (name, instance ID) MUST be set at initialization and MUST be included in all outbound calls and logs.
- **Cross-process:** When engine A calls engine B or platform services, the caller identity MUST be asserted (e.g., via certificate, JWT, or API key) so that the callee can authorize and audit.
- **No impersonation:** Engines MUST NOT assume the identity of a user or tenant unless explicitly delegated (e.g., delegated token); engine-to-engine calls use engine/service identity.

---

## 4. Identity in Audit and Tracing

- Every decision and lineage record MUST include the identity of the engine(s) that produced it.
- Every cross-engine call MUST be attributable to a caller identity in logs and traces.
- Identity MUST be retained per audit and compliance policy.

---

## 5. References

- [auth.md](./auth.md)
- [authz.md](./authz.md)
- [trust-model.md](./trust-model.md)
- [engine-core/specs/engine-contracts.md](../../engine-core/specs/engine-contracts.md)
