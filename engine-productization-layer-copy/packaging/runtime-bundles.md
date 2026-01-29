# Runtime Bundles

## Purpose

Define runtime bundles for NEXUS-ENGINE: packaged engine runtime plus dependencies suitable for execution as a process (self-hosted, on-prem, edge). Additive; no change to engine behavior or APIs.

## Principles

- **Runnable artifact**: Bundle contains engine runtime, config surface, and dependencies; customer runs the process; no hosting by provider (see offerings/engine-as-a-runtime).
- **Environment-agnostic**: Bundle supports multiple runtimes (Node, .NET, Python as applicable); packaging is additive layer; engine core unchanged.
- **Deployment-ready**: Bundle is suitable for bare metal, VM, or container orchestration; installation and upgrade paths documented.

## Bundle Contents

| Component | Description | Source |
|-----------|-------------|--------|
| Engine runtime | Executable entrypoint (API server, worker, or both) | engine-api, engine-core |
| Config surface | Schema and defaults; no secrets in bundle | config/ |
| Dependencies | Locked runtime dependencies (Node modules, .NET packages, Python venv) | Lockfiles |
| Health/readiness | Health endpoints and startup checks | engine-api, health/ |
| Optional: CLI | Command-line tools for admin, migration, or validation | ops, scripts |

## Packaging Formats

| Format | Use case | Consumer |
|--------|----------|----------|
| Tarball (.tar.gz) | Linux/macOS; manual or scripted install | Developer, professional, enterprise |
| ZIP | Windows or cross-platform | Developer, professional |
| Package manager | apt, yum, brew, chocolatey (org-specific) | Enterprise, regulated |
| Installer | GUI or silent install (org-specific) | Enterprise, sovereign |

## Versioning and Compatibility

- Runtime bundle version aligns with engine semantic version; compatibility policy applies (governance/compatibility-policy).
- Upgrade path: documented minor/patch upgrade procedure; major may require migration or reinstall.
- No engine logic or API changes; runtime bundle is packaging only.

## Tier and License Alignment

- **Community / developer**: Unrestricted or usage-capped runtime bundle (see licensing/oss, licensing/usage).
- **Professional / enterprise**: Licensed runtime bundle; license validation at startup or via entitlement (commercial/license-validation).
- **Regulated / sovereign**: Signed bundle, air-gapped delivery, audit trail (distribution/air-gapped, tiers/regulated, tiers/sovereign).

## Certification Readiness

- Runtime bundle spec documented; build and signing are org-specific.
- No engine regression.
