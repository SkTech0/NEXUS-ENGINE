# API Governance

**Status:** Standard  
**Owner:** Platform Architecture / API  
**Classification:** API Platform — Governance  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS governs APIs: design review, breaking change process, stability guarantees, and compliance with platform standards. API governance is required for API productization and commercial deployment.

---

## 2. Governance Principles

- **Stability:** APIs are a product; breaking changes are exceptional and governed.
- **Consistency:** APIs follow platform standards (versioning, deprecation, contracts, security).
- **Documentation:** All public APIs MUST be documented (OpenAPI or equivalent); docs MUST be kept current with implementation.
- **Backward compatibility:** Within a major version, backward compatibility MUST be maintained per compatibility.md.

---

## 3. Design Review

- **New APIs:** New public APIs MUST undergo design review (e.g., API review board or platform architect); review MUST cover schema, versioning, security, and compatibility.
- **Changes:** Additive changes (new optional fields, new endpoints) MAY be reviewed lightly; breaking changes MUST go through full review and deprecation process.
- **Engine APIs:** APIs that expose engine execution MUST align with engine-core/specs/engine-contracts.md and lifecycle.

---

## 4. Breaking Change Governance

- **Definition:** Any change that breaks existing clients per compatibility.md is a breaking change.
- **Process:** Breaking change → new major version (or new endpoint) → deprecation of old version per deprecation.md → sunset after notice period.
- **Approval:** Breaking changes MUST be approved (e.g., product, platform, legal where customer commitment exists); notice period MUST be defined and communicated.
- **Exception:** Security-critical breaking changes MAY have shorter notice; MUST be documented and communicated urgently.

---

## 5. Stability Guarantees

- **Commitment:** Within a supported major version, the platform commits to backward compatibility; no breaking changes without new major version and deprecation.
- **Support window:** Supported versions and sunset dates MUST be published (e.g., compatibility matrix, deprecation policy).
- **Error budget and SLO:** API availability and latency are subject to SLO/error budget (see ops/slo.md, error-budgets.md); governance does not override operational response.

---

## 6. Compliance and Security

- **Authentication and authorization:** All public APIs MUST enforce authn/authz per security/engine (auth.md, authz.md); exceptions (e.g., public health check) MUST be explicit and documented.
- **Rate limiting and QoS:** APIs MUST comply with platform QoS and rate limiting (platform/distributed-standards/qos.md, sla.md).
- **Data and lineage:** APIs that expose decisions or sensitive data MUST comply with governance (data lineage, decision lineage, retention).

---

## 7. References

- [versioning.md](./versioning.md)
- [deprecation.md](./deprecation.md)
- [compatibility.md](./compatibility.md)
- [contracts.md](./contracts.md)
- [sdk-strategy.md](./sdk-strategy.md)
- [engine-core/specs/engine-contracts.md](../engine-core/specs/engine-contracts.md)
- [security/engine/auth.md](../security/engine/auth.md)
