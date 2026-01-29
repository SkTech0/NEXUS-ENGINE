## Environment packs (`env/`)

This repository uses **environment packs** under `env/<environment>/` to hold configuration templates for each deployment stage.

### Supported environments

- `local`: developer workstation / permissive defaults
- `dev`: shared development / semi-secure
- `qa`: test validation / strict
- `staging`: production-like / strict + prod parity
- `prod`: hardened / locked

### Pack contents (per environment)

Each environment pack contains the following files:

- `appsettings.json` (application-level settings, connection string refs, secrets provider selection)
- `engine-config.yaml` (engine runtime mode + endpoints + compatibility posture)
- `ai-config.yaml` (AI provider + model selection + safety posture)
- `observability.yaml` (OTel/metrics/tracing/logging posture)
- `security.yaml` (auth mode + TLS + headers + rate limiting + audit posture)
- `infra.yaml` (platform posture and deployment envelope metadata; **not** infra-as-code)

> Note: `env/local` and `env/dev` already existed prior to this scaffolding. They are treated as **legacy packs**; new packs added here follow the same top-level schema. One known drift exists in `engine-config.yaml` between `local` and `dev` regarding model registry location (file path vs API endpoint). This is documented here to avoid silent mismatches while keeping changes additive-only.

### Config hierarchy and precedence order

The intended precedence order for configuration resolution is:

1. **Defaults** (code defaults / schema defaults)
2. **Environment pack** (`env/<env>/...`)
3. **Secrets** (Vault / Key Vault / Secrets Manager) injected at runtime
4. **Runtime overrides** (env vars / command-line / deployment metadata)

This enables immutable artifacts with environment-specific behavior controlled exclusively by configuration and runtime injection.

### Override points

- **Environment selection**: `NEXUS_ENV` (e.g. `local|dev|qa|staging|prod`)
- **Primary connection string**: `ConnectionStrings__Primary`
- **Secrets provider selection**: `Secrets__Provider` (e.g. `env|vault|azurekeyvault|awssecretsmanager`)
- **OTel exporter endpoint**: `Observability__Otel__Endpoint` or `observability.otel.collectorEndpoint`

### Secrets injection points (no secrets in repo)

All secret material must be injected at runtime via one of the supported patterns:

- **HashiCorp Vault**: token / Kubernetes auth → KV v2
- **Azure Key Vault**: managed identity / service principal
- **AWS Secrets Manager**: IAM role / access keys

Environment packs should contain only:

- **references** (e.g. env var names) and
- **paths/prefixes** (e.g. Vault KV prefix)

### Env var bindings (common conventions)

- JSON `appsettings.json` uses .NET-style env var bindings: `Section__Subsection__Key`
  - Example: `ConnectionStrings__Primary`
  - Example: `Secrets__Vault__Address`
- YAML files document env var injection points using `...EnvVar` fields, or by referencing `ConnectionStrings__Primary` as a ref.

