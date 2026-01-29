## Key management (scaffold)

This document defines enterprise-grade patterns for managing encryption and signing keys used by Nexus Engine.

### Principles

- **Least privilege**: workloads get only the minimum permissions required.
- **Separation of duties**: platform/security control key lifecycle; application consumes keys.
- **No long-lived credentials** in code or repos.
- **Auditability**: every key access and rotation must be traceable.

### Key types and uses

- **Signing keys**: JWT signing, webhook signatures, internal token signing.
- **Encryption keys**: encrypting sensitive payloads at rest.
- **API keys**: third-party access keys (AI providers, etc.).

### Storage backends (choose one per environment)

- **HashiCorp Vault**
  - Transit engine for encryption/signing when possible
  - KV v2 for secrets that must be materialized
- **Azure Key Vault**
  - Keys + Secrets
  - Managed Identity for workloads
- **AWS KMS + Secrets Manager**
  - KMS for cryptographic keys
  - Secrets Manager for API keys/connection strings

### Rotation policy (recommended baseline)

- **Prod**
  - Signing keys: rotate every 90 days (or per compliance)
  - Encryption keys: rotate annually; rewrap strategy for data keys
  - API keys: rotate per provider constraints (quarterly recommended)
- **Non-prod**
  - Rotate more frequently or on-demand to validate automation

### Rotation strategy patterns

- **Dual key / overlapping validity**
  - Publish new key (kid = new)
  - Keep old key active for verification during rollout window
  - Retire old key after all clients confirm upgrade
- **Canary key roll**
  - Rotate in staging first
  - Canary subset in prod
  - Full rollout after validation gates pass

### Access patterns

- Prefer **workload identity**:
  - k8s auth to Vault
  - Azure Managed Identity
  - AWS IAM role for service account (IRSA)

### Incident handling (break-glass)

- Emergency rotation must follow:
  - incident ticket + approval
  - immediate rotation + forced re-auth where applicable
  - post-incident review and validation

