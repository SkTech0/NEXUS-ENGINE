# API Deprecation Strategy

**Status:** Standard  
**Owner:** Platform Architecture / API  
**Classification:** API Platform — Deprecation  
**Version:** 1.0

---

## 1. Purpose

This document defines how NEXUS deprecates APIs and versions: notice period, communication, and sunset. Deprecation must be predictable and fair to consumers for commercial and enterprise deployment.

---

## 2. Deprecation Lifecycle

### 2.1 Announcement

- **Deprecation notice:** Deprecation MUST be announced with clear effective date and sunset date (end of support).
- **Channels:** Release notes, API docs, email to known consumers, and (where applicable) response headers (e.g., `Deprecation: true`, `Sunset: <date>`).
- **Notice period:** Minimum notice period MUST be defined (e.g., 6 months for major version sunset); MUST be documented in api-governance.

### 2.2 Support Period

- **Supported:** Deprecated version remains supported (security fixes, critical bugs) until sunset date.
- **No new features:** New features and non-critical changes apply to current version only.
- **Documentation:** Deprecated version remains documented until sunset; docs MUST state deprecation and migration path.

### 2.3 Sunset

- **Sunset date:** After sunset date, deprecated version MAY be retired (endpoint removed or returns 410 Gone).
- **Grace period:** Optional short grace period (e.g., 410 with redirect or migration instructions) before full removal; MUST be documented.
- **Consumers:** Consumers MUST migrate before sunset; platform is not responsible for breaking consumers who did not migrate after notice.

---

## 3. Breaking Change Governance

- **Definition:** Any change that breaks existing clients (e.g., removed field, changed type, removed endpoint) is a breaking change.
- **Process:** Breaking changes require new major version (or new endpoint); deprecation of old version per this policy.
- **Exception:** Security-critical breaking changes MAY have shorter notice; MUST be communicated urgently and documented.

---

## 4. References

- [versioning.md](./versioning.md)
- [compatibility.md](./compatibility.md)
- [api-governance.md](./api-governance.md)
- [versioning/deprecation-policy.md](../../versioning/deprecation-policy.md) (existing)
