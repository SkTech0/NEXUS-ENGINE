# Air-Gapped Distribution

## Purpose

Define air-gapped distribution for NEXUS-ENGINE: delivery of the engine for deployment in environments with no or restricted outbound connectivity (no pull from public registry, no SaaS API). Additive; no change to engine behavior or APIs.

## Principles

- **Offline-first**: All artifacts (container image, runtime bundle, deployment manifests, optional dependencies) are delivered in a single offline package (e.g., tarball, USB, secure transfer); no runtime pull from internet.
- **Integrity**: Package is checksummed and optionally signed; supply-chain integrity documented (packaging/runtime-bundles, container-bundles).
- **Upgrades**: Upgrades delivered as subsequent offline packages; version and compatibility governed (governance/compatibility-policy, lifecycle-management).

## Package Contents

| Component | Description |
|-----------|-------------|
| **Container image** | OCI image tarball(s) or equivalent (packaging/container-bundles) |
| **Runtime bundle** | Optional; if not container-only (packaging/runtime-bundles) |
| **Deployment manifests** | Kubernetes YAML, Helm chart, or equivalent (packaging/deployment-bundles) |
| **Config schema** | Defaults and schema; no secrets |
| **Checksums / signatures** | SHA-256, optional code signing |
| **Release notes** | Version, compatibility, upgrade path |

## Tier and Use Case Alignment

- **Enterprise / regulated / sovereign**: Air-gapped common for high-security or regulated environments (tiers/enterprise, regulated, sovereign).
- **License**: Runtime or enterprise license; license validation may be offline (e.g., license file) or deferred (commercial/license-validation).
- **Support**: Upgrade and patch process documented; no engine logic or API changes; air-gapped is distribution only.

## Certification Readiness

- Air-gapped distribution documented; package format and delivery are org-specific.
- No engine regression.
