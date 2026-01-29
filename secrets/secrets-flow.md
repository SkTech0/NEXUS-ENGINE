## Secrets flow (scaffold)

This repo provides **patterns and templates only**. No real secrets are stored in git.

### Goals

- **No secrets in repo**
- **Consistent injection model** across local/dev/qa/staging/prod
- **Centralized resolution** with deterministic precedence:
  - defaults → env pack → secrets → runtime overrides

### Inputs

- **Environment pack**: `env/<env>/...`
  - Contains *references* (env var names / Vault prefixes / Key Vault URLs)
  - Does not contain credentials or secret values
- **Secrets provider**: one of
  - HashiCorp Vault
  - Azure Key Vault
  - AWS Secrets Manager
- **Runtime**: env vars, deployment metadata, command-line args (if used)

### Output

A resolved configuration bundle containing:

- non-secret values from env pack
- secret values injected at runtime
- optional runtime override values (for emergency changes)

### Precedence model (highest wins)

1. **Defaults**: schema defaults or application defaults
2. **Environment pack**: `env/<env>/...`
3. **Secrets provider**: inject secret values (connection strings, API keys, signing keys)
4. **Runtime overrides**: emergency overrides (time-bounded; auditable)

### Provider patterns

#### HashiCorp Vault pattern

- **Auth**:
  - Local/dev: token (acceptable for workstation only)
  - k8s: Kubernetes auth (recommended)
  - CI: AppRole (restricted, rotated)
- **KV**:
  - KV v2 recommended
  - Prefix per env: `nexus-engine/<env>`
- **Example mapping**:
  - `ConnectionStrings:Primary` → `kv/data/nexus-engine/prod/db.primary`

See `secrets/vault-config.yaml` for the scaffolded mapping template.

#### Azure Key Vault pattern

- **Auth**:
  - Managed Identity preferred (no client secrets)
  - Service principal supported for CI with strict rotation
- **Naming**:
  - Use deterministic secret names:
    - `nexus-engine--prod--connectionstrings--primary`
    - `nexus-engine--prod--ai--azure-openai--api-key`

#### AWS Secrets Manager pattern

- **Auth**:
  - IAM role for workload (preferred)
  - Access keys only for controlled CI cases (rotate)
- **Naming**:
  - Use deterministic secret IDs:
    - `nexus-engine/prod/connectionStrings/primary`
    - `nexus-engine/prod/ai/openai/apiKey`

### Operational guardrails

- **Never log secrets**. Ensure redaction is enabled in audit/logging layers.
- **Rotation**:
  - DB creds: rotate per policy and re-deploy
  - API keys: rotate with dual-key overlap where supported
- **Break-glass**:
  - Temporary runtime overrides must be time-bounded, approved, and audited.

