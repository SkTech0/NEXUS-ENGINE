# Lifecycle Management

## Purpose

Define lifecycle management for NEXUS-ENGINE: how engine and product versions are released, supported, and retired (support windows, EOL, upgrade path). Additive; no change to engine behavior or APIs.

## Principles

- **Versioned lifecycle**: Engine and product (packaging, API product) follow versioned lifecycle; support window and EOL are defined (governance/deprecation-policy).
- **Compatibility**: Lifecycle respects compatibility policy (governance/compatibility-policy); upgrade path documented.
- **No engine logic change**: Lifecycle management is process and policy; engine code and API change only per release process.

## Lifecycle Stages

| Stage | Description |
|-------|-------------|
| **Development** | In development; not generally available |
| **GA** | Generally available; supported per policy |
| **Maintenance** | Security and critical fixes only; no new features |
| **EOL announced** | End-of-life announced; sunset date set (governance/deprecation-policy) |
| **EOL** | End-of-life; no support; upgrade required |

## Support Window

| Aspect | Description |
|--------|-------------|
| **Support duration** | How long a major version is supported (e.g., N months after next major); org-specific |
| **Maintenance** | Security and critical fixes; duration org-specific |
| **Upgrade path** | Documented upgrade path (e.g., 2.x → 3.x); compatibility policy (governance/compatibility-policy) |
| **EOL notice** | Notice period before EOL (e.g., 12 months); deprecation policy (governance/deprecation-policy) |

## Scope

- **Engine**: Engine core, engine-api, engine-intelligence, engine-trust, engine-optimization; version and support per org.
- **Product**: Packaging (distributions, bundles), API product (plans, quotas), SDK; version and support per org.
- **Ecosystem**: Plugin, connector, extension versions; compatibility (governance/compatibility-policy).
- No engine logic or API changes; lifecycle management is process only.

## Certification Readiness

- Lifecycle management documented; support window and EOL are org-specific.
- No engine regression.
