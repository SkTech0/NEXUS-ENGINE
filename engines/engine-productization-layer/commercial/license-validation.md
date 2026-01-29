# License Validation

## Purpose

Define license validation for NEXUS-ENGINE: how runtime, embedded, or enterprise licenses are validated (at startup, heartbeat, or via entitlement) without modifying engine behavior or APIs.

## Principles

- **Validation at boundary**: License validation occurs at startup, launcher, or platform; engine may receive a “valid” signal or no signal (engine does not enforce); no engine logic change.
- **Pluggable**: Validation is pluggable layer (license server, entitlement API, or offline license file); implementation org-specific.
- **Enforcement**: Invalid or expired license may block startup or degrade (e.g., read-only); enforcement is launcher/platform, not engine request path.

## Validation Modes

| Mode | Description | Use case |
|------|-------------|----------|
| **Startup** | Validate once at process start | Runtime, container (licensing/runtime) |
| **Heartbeat** | Periodic validation (e.g., daily) | Runtime, managed (licensing/runtime) |
| **Entitlement** | EaaS; no local license; entitlement from platform | EaaS (offerings/engine-as-a-service) |
| **Offline** | License file or token; no network | Air-gapped (distribution/air-gapped); regulated, sovereign |
| **Embedded** | Build-time or runtime token for ISV/OEM | Embedded (licensing/embedded) |

## Validation Scope

| Aspect | Description |
|--------|-------------|
| **License key / token** | Key or token presented to validator; scope (nodes, expiry, features) in license |
| **Validator** | License server, entitlement API, or local validation; org-specific |
| **Failure** | Block startup, degrade, or warn; org-specific |
| **Engine** | Engine does not perform validation; launcher or platform does |
| **Entitlement** | For EaaS, entitlement (commercial/entitlements) replaces local license |

## Tier and License Alignment

- **Runtime license** (licensing/runtime): Validation at startup or heartbeat for self-hosted runtime.
- **Enterprise** (licensing/enterprise): Validation per contract; may be entitlement or license server.
- **Regulated / sovereign**: Offline or air-gapped validation (distribution/air-gapped); no engine logic change.
- No engine regression.

## Certification Readiness

- License validation documented; validator and failure behavior are org-specific.
- No engine regression.
