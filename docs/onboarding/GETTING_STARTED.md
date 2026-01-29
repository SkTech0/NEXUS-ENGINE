# Getting Started — Git First, Then Production

Do these in order: **1) Git**, **2) Production readiness**, **3) Go live**.

---

## Part 1: Upload to Git (do this first)

### 1.1 Initialize and commit (if no repo yet)

```bash
cd /Users/satyamkumar/Desktop/NEXUS-ENGINE

# Create repo
git init

# Ensure .gitignore is in place (already exists; ignores node_modules, dist, .env, etc.)
git add .
git status   # Review what will be committed

# First commit
git commit -m "Initial commit: NEXUS-ENGINE monorepo with service shells and deployment"
```

### 1.2 Create repo on GitHub/GitLab and push

**GitHub:**

1. Go to [github.com/new](https://github.com/new).
2. Create a repo (e.g. `NEXUS-ENGINE`). **Do not** add README, .gitignore, or license (you already have them).
3. Then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/NEXUS-ENGINE.git
git branch -M main
git push -u origin main
```

**GitLab / Bitbucket:** Same idea — create empty repo, add `origin`, push `main`.

### 1.3 If you use SSH

```bash
git remote add origin git@github.com:YOUR_USERNAME/NEXUS-ENGINE.git
git push -u origin main
```

---

## Part 2: Is this ready for production?

**Short answer:** The **structure** is production-oriented (service shells, gateway, orchestration, Docker, Compose, K8s), but **going live** still needs env, secrets, and optional hardening.

| Area | Status | Before production |
|------|--------|-------------------|
| Code layout & services | ✅ Decoupled services, gateway, deployment | — |
| Build (UI, API) | ✅ Nx + dotnet | Run full build and fix any failures |
| Config | ⚠️ Env-based | Set production env and secrets (see below) |
| Secrets | ⚠️ Template only | Use vault or env, never commit secrets |
| CI/CD | ✅ `.github/workflows` exists | Point to your repo; add deploy step if needed |
| Health & probes | ✅ Per-service health/ready/live | Use in K8s/Compose |
| Monitoring | ⚠️ Infra present | Wire to your alerting and dashboards |

So: **yes, you can take it to production** once you complete the checklist below.

---

## Part 3: How to go live

### Option A: Run locally (single machine)

```bash
# 1. Install dependencies
npm install

# 2. Run API (requires .NET SDK)
./run-api.sh
# or: cd apps/engine-api/src/EngineApi && dotnet run

# 3. Run UI (another terminal)
npx nx serve product-ui

# 4. Optional: run a service shell (e.g. engine-core)
npx ts-node platform-runtime/service-shells/engine-core-service/runner.ts
```

### Option B: Docker Compose (good for staging/single host)

```bash
# From repo root — build and run one or more services
docker compose -f deploy/compose/engine-api.yml up -d
docker compose -f deploy/compose/product-ui.yml up -d

# Or run all (you’d add a combined compose file or script)
# See deploy/compose/*.yml for each service
```

### Option C: Kubernetes

```bash
# 1. Build images (example; push to your registry)
docker build -f deploy/docker/engine-api.Dockerfile -t your-registry/nexus-engine-api:latest .
docker build -f deploy/docker/product-ui.Dockerfile -t your-registry/nexus-product-ui:latest .
docker push your-registry/nexus-engine-api:latest
docker push your-registry/nexus-product-ui:latest

# 2. Optional ConfigMap
kubectl apply -f deploy/k8s/nexus-env-configmap.yaml

# 3. Deploy (update image in YAML to your registry)
kubectl apply -f deploy/k8s/engine-api-deployment.yaml
kubectl apply -f deploy/k8s/product-ui-deployment.yaml
```

### Before production checklist

1. **Environment**
   - Set `NEXUS_ENV=production` where you run.
   - Use `secrets/secrets-template.env` as a template; fill real values in CI or vault, **never** commit secrets.

2. **API URL for UI**
   - In production, point `product-ui` to the real API URL (env or `environment.prod.ts`).

3. **Build & test**
   - `npm run build` (or `nx run-many --target=build --all`).
   - Run tests: `npm run test` (or per-project).
   - Run engine-api tests if you use it.

4. **CI/CD**
   - Use existing `.github/workflows` (ci, cd, security); point them at your Git remote.
   - Add a deploy job (e.g. build images, push to registry, deploy to K8s or Compose).

5. **Secrets**
   - Store production secrets in a vault or CI secrets; inject via env or mounted files, not in repo.

---

## Quick reference

| Step | Command / location |
|------|--------------------|
| First-time Git | `git init` → `git add .` → `git commit` → add `origin` → `git push` |
| Project map | `docs/guides/PROJECT_STRUCTURE.md` |
| Run UI | `npx nx serve product-ui` |
| Run API | `./run-api.sh` or `dotnet run --project apps/engine-api/src/EngineApi/EngineApi.csproj` |
| Deploy (Compose) | `deploy/compose/*.yml` |
| Deploy (K8s) | `deploy/k8s/*.yaml` |
| Ownership & teams | `team-boundaries/` |
