# API Compatibility Matrix

**Status:** Standard  
**Owner:** Platform Architecture / API  
**Classification:** API Platform — Compatibility  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS expresses and maintains API compatibility: backward compatibility rules, compatibility matrix format, and consumer upgrade paths. Compatibility is required for API productization and safe upgrades.

---

## 2. Backward Compatibility Rules

### 2.1 Allowed (Backward-Compatible)

- **Adding optional request fields:** New optional fields; existing clients omit them and continue to work.
- **Adding response fields:** New response fields; existing clients ignore them (or document that clients MUST ignore unknown fields).
- **Adding new endpoints:** New paths or methods; existing endpoints unchanged.
- **Adding new enum values:** New values in enums; existing clients that do not handle them MUST not break (e.g., treat as unknown or forward-compatible).
- **Relaxing validation:** Loosening validation (e.g., longer string length); existing valid requests still valid.

### 2.2 Not Allowed (Breaking)

- **Removing or renaming fields:** Removed or renamed request/response fields break clients.
- **Changing field type or semantics:** Type change or meaning change breaks clients.
- **Removing endpoints or methods:** Removal breaks clients.
- **Making optional required:** Previously optional field made required breaks clients that omit it.
- **Strictening validation:** Tightening validation may reject previously valid requests.

### 2.3 Gray Areas

- **Changing default values:** May break clients that rely on previous default; treat as breaking unless explicitly documented as unspecified.
- **Changing error codes or messages:** May break clients that parse errors; treat as breaking for machine parsing.
- **Changing order or format:** Order of array elements or serialization format; treat as breaking if documented as stable.

---

## 3. Compatibility Matrix Format

### 3.1 Matrix Contents

- **Rows:** API version (e.g., v1, v2).
- **Columns:** Consumer SDK version, server version, or dependency version.
- **Cells:** Supported / not supported / deprecated; upgrade path (e.g., “v1 → v2 migration guide”).

### 3.2 Publication

- Matrix MUST be published (e.g., in docs or versioning repo); MUST be updated on each release.
- Deprecation and sunset dates MUST be visible in matrix or linked from deprecation policy.

---

## 4. Consumer Upgrade Paths

- **Migration guides:** Each major version upgrade MUST have a migration guide (breaking changes, migration steps, and timeline).
- **SDK compatibility:** SDK versions MUST document which API versions they support (see sdk-strategy.md).
- **Testing:** Compatibility tests (e.g., contract tests) MUST run in CI to prevent accidental breaking changes.

---

## 5. References

- [versioning.md](./versioning.md)
- [deprecation.md](./deprecation.md)
- [contracts.md](./contracts.md)
- [api-governance.md](./api-governance.md)
- [versioning/compatibility-matrix.md](../../versioning/compatibility-matrix.md) (existing)
