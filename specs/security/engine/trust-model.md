# Engine Trust Model

**Status:** Standard  
**Owner:** Platform Architecture / Security  
**Classification:** Security — Trust  
**Version:** 1.0

---

## 1. Purpose

This document defines the trust model for NEXUS: what the platform trusts, what consumers trust, and how trust boundaries are maintained. A clear trust model is required for secure design and commercial liability.

---

## 2. Trust Assumptions

### 2.1 Platform Trusts

- **Infrastructure:** Hardware, hypervisor, and orchestrator are operated in a controlled environment; compromise is assumed to be possible and mitigated by defense in depth.
- **Identity provider:** Issued tokens and credentials are valid for the claimed identity within their validity period.
- **Secrets store:** Secrets (API keys, certificates) are stored and retrieved securely; access is audited.
- **Engine implementations:** Engines that are registered and certified comply with engine contracts and do not intentionally exfiltrate data or bypass controls; non-compliant engines are out of scope for trust.

### 2.2 Consumer Trusts

- **Platform:** The platform correctly authenticates and authorizes; does not misuse tenant data; and meets stated SLAs and compliance commitments.
- **Engines:** Engine outputs (decisions, scores) are produced per contract and lineage; no undocumented backdoors or data leakage.
- **Operators:** Platform operators follow runbooks and access controls; actions are audited.

---

## 3. Trust Boundaries

### 3.1 External Boundary

- **Internet / untrusted networks:** All inbound traffic is untrusted until authenticated and authorized; TLS for confidentiality and integrity; input validation and rate limiting at the edge.
- **Outbound:** Calls to external systems are explicit; credentials and data shared only per policy.

### 3.2 Internal Boundary

- **Between engines:** Engine-to-engine calls are authenticated and authorized; network may be trusted segment but identity is still verified (zero-trust style).
- **Between platform and data:** Data stores and caches are accessed with least-privilege credentials; encryption at rest and in transit per policy.
- **Between tenants:** Strong isolation; no cross-tenant access unless explicitly shared and governed.

### 3.3 Operational Boundary

- **Human operators:** Access to production is role-based and audited; break-glass procedures documented.
- **CI/CD and automation:** Pipelines use dedicated credentials; no production secrets in code or logs.

---

## 4. Threat Model (Summary)

- **Threats in scope:** Unauthorized access (broken auth/authz), credential theft, tenant data leakage, injection, and denial of service.
- **Mitigations:** Authentication, authorization, encryption, isolation, rate limiting, and audit (see zero-trust.md, policy.md).
- **Out of scope (or limited):** Advanced persistent threats, physical compromise, and supply-chain attacks are acknowledged; mitigations are defense in depth and vendor/process controls.

---

## 5. References

- [identity.md](./identity.md)
- [auth.md](./auth.md)
- [authz.md](./authz.md)
- [zero-trust.md](./zero-trust.md)
- [policy.md](./policy.md)
