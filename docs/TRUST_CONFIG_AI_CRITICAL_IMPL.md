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

## Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| TRUST_JWT_SECRET | engine-trust | JWT signing secret (HS256) |
| TRUST_JWT_STRICT | engine-trust | Require secret (reject unverified) |
| TRUST_JWT_ISSUER | engine-trust | Expected issuer |
| TRUST_JWT_AUDIENCE | engine-trust | Expected audience |
| Trust:JwtSecret | engine-api | Same for in-process stub |

---

## Deploy

- **engine-trust**: `deploy/railway/engine-trust/Dockerfile` — includes PyJWT
- **engine-ai**: `deploy/railway/engine-ai/Dockerfile` — includes training job queue
- **Test**: `./scripts/test-trust-config-ai.sh [TRUST_URL] [AI_URL]`
