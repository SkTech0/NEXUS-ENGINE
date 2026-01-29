# Compatibility Policy

## Purpose

Define compatibility policy for NEXUS-ENGINE: what constitutes backward compatibility, how versions are compatible, and what breaking changes require (versioning, deprecation). Additive; no change to engine behavior or APIs.

## Principles

- **Backward compatibility**: Within same major version, backward compatibility is maintained; breaking changes require new major version or deprecation path (governance/deprecation-policy).
- **Semantic versioning**: Engine and product follow semver where applicable; major.minor.patch; compatibility rules align with semver.
- **No engine logic change**: Compatibility policy is process and contract; engine code and API change only per release and deprecation policy.

## Compatibility Rules

| Change type | Compatibility | Versioning |
|-------------|---------------|------------|
| **Backward-compatible** | New optional field, new endpoint, bug fix | Minor or patch |
| **Breaking** | Removed or changed field, removed endpoint, behavior change | Major; or deprecation then major |
| **Deprecation** | Deprecated but supported until sunset (governance/deprecation-policy) | Announce; remove at sunset (major) |

## Scope

| Element | Description |
|---------|-------------|
| **API** | Request/response schema, paths, semantics (contracts/) |
| **Config** | Config schema and defaults (config/) |
| **SDK** | SDK version vs API version; compatibility matrix org-specific |
| **Packaging** | Bundle format, deployment manifest; compatibility org-specific |
| **Ecosystem** | Plugin, connector API; compatibility org-specific |

## Upgrade and Migration

- **Minor/patch**: Upgrade without breaking; documented.
- **Major**: Breaking change or removal of deprecated; migration path documented (governance/deprecation-policy, lifecycle-management).
- No engine logic or API changes; compatibility policy is contract and process only.

## Certification Readiness

- Compatibility policy documented; semver and breaking change rules are org-specific.
- No engine regression.
