# SDK Strategy

**Status:** Standard  
**Owner:** Platform Architecture / API  
**Classification:** API Platform — SDK  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS provides and maintains SDKs for API consumers: language support, versioning, stability guarantees, and distribution. SDKs are required for API productization and developer experience.

---

## 2. SDK Scope

### 2.1 Target Languages

- **Priority:** SDKs SHOULD be provided for languages that align with target customers (e.g., TypeScript/JavaScript, Python, .NET, Go).
- **Coverage:** At least one SDK for primary API surface (e.g., engine execution, decisions, trust); MAY be expanded per product need.
- **OpenAPI-based:** SDKs MAY be generated from OpenAPI spec where feasible; hand-curated SDKs MAY be used for better DX where justified.

### 2.2 SDK Surface

- **Core operations:** Authentication, engine execute, decisions, and (where applicable) streaming or webhooks.
- **Convenience:** Retries, idempotency keys, correlation ID propagation, and logging SHOULD be built-in or documented.
- **Stability:** Public SDK API MUST follow stability guarantees (see api-governance.md); breaking changes require major version and deprecation.

---

## 3. Versioning and Compatibility

- **SDK versioning:** SDKs SHOULD use semantic versioning (major.minor.patch); major bump for breaking changes.
- **API version mapping:** SDK version MUST document which API version(s) it supports; compatibility matrix (see compatibility.md) MUST include SDK ↔ API mapping.
- **Backward compatibility:** Within same major SDK version, backward compatibility MUST be maintained; new minor/patch MAY add features or fix bugs without breaking callers.

---

## 4. Distribution

- **Package managers:** SDKs SHOULD be published to standard package managers (e.g., npm, PyPI, NuGet, Go modules).
- **Documentation:** SDK docs MUST include installation, authentication, and usage examples; MUST link to API version and compatibility.
- **Changelog:** SDK releases MUST have changelog; breaking changes MUST be clearly stated and migration path provided.

---

## 5. Stability Guarantees

- **Public API:** Exported types, methods, and options are the public API; internal implementation MAY change without notice.
- **Deprecation:** Deprecated APIs MUST be marked (e.g., annotation, doc); MUST be removed only in major version with notice per deprecation.md.
- **Support:** SDK version support lifecycle MUST align with API version support (e.g., SDK for deprecated API version may be deprecated with same sunset).

---

## 6. References

- [versioning.md](./versioning.md)
- [compatibility.md](./compatibility.md)
- [contracts.md](./contracts.md)
- [api-governance.md](./api-governance.md)
- [deprecation.md](./deprecation.md)
