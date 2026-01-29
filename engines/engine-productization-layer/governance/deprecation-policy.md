# Deprecation Policy

## Purpose

Define deprecation policy for NEXUS-ENGINE: how features, APIs, or product elements are deprecated and sunset (notice period, migration path, EOL). Additive; no change to engine behavior or APIs.

## Principles

- **Deprecation is process**: Deprecation policy defines notice period, communication, migration path, and sunset; engine or API change only when deprecated element is removed per policy.
- **No surprise removal**: Deprecated elements are announced and supported until sunset; compatibility policy (governance/compatibility-policy) and lifecycle (governance/lifecycle-management) align.
- **Migration path**: Migration path (e.g., use new API, upgrade version) is documented; no engine logic change except removal at sunset.

## Deprecation Process

| Step | Description |
|------|-------------|
| **Announce** | Deprecation announced; sunset date and migration path published |
| **Notice period** | Minimum notice (e.g., 6–12 months) before sunset; org-specific |
| **Support** | Deprecated element supported until sunset; no new features |
| **Sunset** | Element removed or disabled at sunset; upgrade/migration required |
| **Communication** | Changelog, docs, email, status page; org-specific |

## Scope

| Element | Description |
|---------|-------------|
| **API** | API path, parameter, or behavior; migration to new API or version |
| **Engine feature** | Engine feature or config; migration path documented |
| **Product** | Packaging format, plan, distribution; migration path documented |
| **SDK** | SDK version or method; compatibility (governance/compatibility-policy) |
| **Ecosystem** | Plugin, connector version; compatibility |

## Engine Alignment

- Deprecation policy does not change engine logic or API until sunset; it governs process and communication.
- No engine regression except at planned sunset per policy.

## Certification Readiness

- Deprecation policy documented; notice period and sunset are org-specific.
- No engine regression.
