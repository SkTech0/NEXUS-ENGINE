# Trust Verify, Config YAML, AI Training — Implementation Summary

Enterprise-grade implementation of three critical components (branch: `feat/trust-config-ai-critical-impl`).

---

## 1. Trust Verify — JWT Verification

### engine-trust-service

- **`app/verification/jwt_verifier.py`**: JWT verification with PyJWT
  - Validates signature (when TRUST_JWT_SECRET set), expiry, issuer, audience
  - Env: `TRUST_JWT_SECRET`, `TRUST_JWT_ALGORITHMS`, `TRUST_JWT_ISSUER`, `TRUST_JWT_AUDIENCE`, `TRUST_JWT_STRICT`
- **`app/service.py`**: Extracts token from `token`, `jwt`, `accessToken`, `payload` (string or object)
- **requirements.txt**: Added `PyJWT>=2.8.0`

### engine-api (in-process stub)

- **`Services/TrustService.cs`**: JWT verification when ENGINES_TRUST_BASE_URL not set
  - Uses `JwtSecurityTokenHandler`, `SymmetricSecurityKey`
  - Config: `Trust:JwtSecret` or `TRUST_JWT_SECRET`
  - Without secret: validates format and expiry only (dev mode)
- **EngineApi.csproj**: Added `Microsoft.IdentityModel.Tokens`, `System.IdentityModel.Tokens.Jwt`

### API contract

- **Request**: `{ claimType?, payload?: string | { token? } }`
- **Response**: `{ valid: bool, message: string, claims?: object }`

---

## 2. Config Service — YAML Parsing

### config-service.cs (.NET)

- **`config/NexusEngine.Config.csproj`**: New project, YamlDotNet 16.0.0
- **ReadYaml()**: Parses YAML via YamlDotNet, returns `Dictionary<string, object?>`
- Handles missing files, parse errors, nested structures

### config-manager.ts (TypeScript)

- **package.json**: Added `js-yaml` ^4.1.0
- **readYaml()**: Uses `js-yaml.load()`, returns `Record<string, unknown>`
- Handles missing files, returns `{ __path, __missing: true }` when file not found

---

## 3. AI Training — Job Queue

### engine-ai-service

- **`app/training/job_queue.py`**: Thread-safe in-memory job queue
  - `TrainingJob`, `JobStatus` (pending, running, completed, failed, cancelled)
  - `submit()`, `get_status()`, `start()`, `complete()`, `fail()`
- **`app/training/runner.py`**: Runs `train_and_save()` in background thread
- **`app/api.py`**: `POST /api/AI/train` → submit job, `GET /api/AI/train/{jobId}/status` → status
- **`app/service.py`**: `submit_training()`, `get_training_status()`

### API contract

- **POST /api/AI/train**: `{ config?, modelType? }` → `{ status: "accepted", jobId: string, message: string }`
- **GET /api/AI/train/{jobId}/status**: `{ jobId, status, progress, createdAt, startedAt, completedAt, resultPath?, error? }`

---

## Product UI — Verify Token (demo)

The Trust page (`/trust`) includes a **Verify JWT** section:
- **Generate sample**: Fetches a demo JWT from `GET /api/Trust/demo-token` (signed with TRUST_JWT_SECRET). Works in prod when secret is set. Falls back to client-side (`dev-demo-secret`) if API unavailable.
- **Verify**: Calls `POST /api/Trust/verify` and shows valid/invalid + message

**Production**: Generate sample uses the backend, so it works with your configured `TRUST_JWT_SECRET`.  
**Local fallback**: If demo-token API fails, client generates with `dev-demo-secret` — set `TRUST_JWT_SECRET=dev-demo-secret` to verify.

---

## Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| TRUST_JWT_SECRET | engine-trust | JWT signing secret (HS256). Use `dev-demo-secret` for product-ui demo. |
| TRUST_JWT_STRICT | engine-trust | Require secret (reject unverified) |
| TRUST_JWT_ALGORITHMS | engine-trust | Comma-separated (e.g. HS256,RS256) |
| TRUST_JWT_ISSUER | engine-trust | Expected issuer (optional) |
| TRUST_JWT_AUDIENCE | engine-trust | Expected audience. Use `nexus-engine` for demo token. Leave unset to skip audience check. |
| Trust:JwtSecret | engine-api | Same for in-process stub |

---

## Deploy

- **engine-trust**: `deploy/railway/engine-trust/Dockerfile` — includes PyJWT
- **engine-ai**: `deploy/railway/engine-ai/Dockerfile` — includes training job queue
- **Test**: `./scripts/test-trust-config-ai.sh [TRUST_URL] [AI_URL]`
