# API Versioning Strategy

**Status:** Standard  
**Owner:** Platform Architecture / API  
**Classification:** API Platform — Versioning  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS versions APIs: URL, header, or content negotiation; semantic versioning; and compatibility guarantees. Consistent versioning is required for API productization and backward compatibility.

---

## 2. Versioning Approach

### 2.1 Preferred: URL Path Versioning

- **Format:** `/v{major}/...` (e.g., `/v1/engine/execute`, `/v2/engine/execute`).
- **Rationale:** Explicit, cacheable, and easy to route; aligns with common practice for REST APIs.
- **Major version:** Incremented on breaking changes; each major version is supported per deprecation policy.

### 2.2 Alternative: Header Versioning

- **Format:** `Accept-Version: v1` or custom header `X-API-Version: 1`.
- **Use:** Where URL versioning is not feasible (e.g., single path with multiple versions); MUST be documented and supported consistently.

### 2.3 Content Negotiation

- **Format:** `Accept: application/vnd.nexus.v1+json`.
- **Use:** Where media type carries version; MAY be combined with path or header versioning for response format.

---

## 3. Semantic Versioning for API

- **Major (v1 → v2):** Breaking change (e.g., removed field, changed semantics, removed endpoint).
- **Minor (v1.0 → v1.1):** Additive change (e.g., new optional field, new endpoint); backward-compatible.
- **Patch (v1.0.0 → v1.0.1):** Bug fix or non-semantic change; backward-compatible.
- **API version in URL/header:** Typically major only (e.g., v1, v2); minor and patch MAY be communicated in response or docs for compatibility matrix.

---

## 4. Compatibility Guarantees

- **Same major version:** Backward-compatible; clients on v1 MUST continue to work when server is updated within v1 (see compatibility.md).
- **New major version:** Breaking changes; old version supported per deprecation policy (see deprecation.md); clients MUST migrate to new version or stay on supported old version.

---

## 5. References

- [deprecation.md](./deprecation.md)
- [compatibility.md](./compatibility.md)
- [api-governance.md](./api-governance.md)
- [versioning/](../../versioning/) (existing versioning docs)
