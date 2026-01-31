#!/usr/bin/env bash
# Push monorepo contents to SkTech0/* repos.
# Run from NEXUS-ENGINE monorepo root. Requires git and push access.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
WORK="${TMPDIR:-/tmp}/nexus-push-$$"
mkdir -p "$WORK"
trap "rm -rf '$WORK'" EXIT

REPOS=(
  "nexus-engine-data:engine-data:services/engine-data-service:deploy/railway/engine-data"
  "nexus-engine-intelligence:engine-intelligence:services/engine-intelligence-service:deploy/railway/engine-intelligence"
  "nexus-engine-ai:engine-ai:services/engine-ai-service:deploy/railway/engine-ai"
  "nexus-engine-optimization:engine-optimization:services/engine-optimization-service:deploy/railway/engine-optimization"
  "nexus-engine-trust:engine-trust:services/engine-trust-service:deploy/railway/engine-trust"
  "nexus-engine-distributed:engine-distributed:services/engine-distributed-service:deploy/railway/engine-distributed"
)

for spec in "${REPOS[@]}"; do
  IFS=: read -r repo domain service deploy <<< "$spec"
  echo "=== $repo ==="
  dir="$WORK/$repo"
  rm -rf "$dir"
  mkdir -p "$dir"
  cp -R "$ROOT/$domain" "$dir/"
  mkdir -p "$dir/services"
  cp -R "$ROOT/$service" "$dir/services/"
  mkdir -p "$dir/deploy/railway"
  cp -R "$ROOT/$deploy" "$dir/deploy/railway/"
  svc_name="${service#services/}"
  cat > "$dir/Dockerfile" << DOCKERFILE
# $repo — domain + service. Build context: repo root.
FROM python:3.11-slim
WORKDIR /app
COPY $domain/ ./$domain/
COPY $service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY $service/ .
ENV PYTHONPATH=/app/$domain:/app
EXPOSE 8080
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port \${PORT:-8080}"]
DOCKERFILE
  # Ensure .dockerignore or no large/irrelevant files
  touch "$dir/.gitignore"
  echo "__pycache__/" >> "$dir/.gitignore"
  echo "*.pyc" >> "$dir/.gitignore"
  echo ".env" >> "$dir/.gitignore"
  echo "# $repo" > "$dir/README.md"
  echo "Domain: $domain. Service: $service. Extracted from NEXUS-ENGINE monorepo." >> "$dir/README.md"
  (cd "$dir" && git init -q && git add . && git commit -q -m "Initial extraction from NEXUS-ENGINE monorepo" && git branch -M main && git remote add origin "https://github.com/SkTech0/$repo.git" && git push -u origin main)
  echo "Pushed $repo"
done

# engine-api (no Python domain, just engine-api)
echo "=== nexus-engine-api ==="
dir="$WORK/nexus-engine-api"
rm -rf "$dir"
mkdir -p "$dir"
cp -R "$ROOT/engine-api" "$dir/"
mkdir -p "$dir/deploy/railway"
cp -R "$ROOT/deploy/railway/engine-api" "$dir/deploy/railway/"
echo "# nexus-engine-api" > "$dir/README.md"
echo "Extracted from NEXUS-ENGINE monorepo." >> "$dir/README.md"
(cd "$dir" && git init -q && git add . && git commit -q -m "Initial extraction from NEXUS-ENGINE monorepo" && git branch -M main && git remote add origin "https://github.com/SkTech0/nexus-engine-api.git" && git push -u origin main)
echo "Pushed nexus-engine-api"

# product-ui
echo "=== nexus-product-ui ==="
dir="$WORK/nexus-product-ui"
rm -rf "$dir"
cp -R "$ROOT/product-ui" "$dir"
mkdir -p "$dir/deploy/railway"
cp -R "$ROOT/deploy/railway/product-ui" "$dir/deploy/railway/"
echo "# nexus-product-ui" > "$dir/README.md"
echo "Extracted from NEXUS-ENGINE monorepo." >> "$dir/README.md"
(cd "$dir" && git init -q && git add . && git commit -q -m "Initial extraction from NEXUS-ENGINE monorepo" && git branch -M main && git remote add origin "https://github.com/SkTech0/nexus-product-ui.git" && git push -u origin main)
echo "Pushed nexus-product-ui"

# contracts
echo "=== nexus-contracts ==="
dir="$WORK/nexus-contracts"
rm -rf "$dir"
mkdir -p "$dir"
cp -R "$ROOT/engine-contracts" "$dir/"
cp -R "$ROOT/api-platform" "$dir/"
cp -R "$ROOT/contracts" "$dir/"
echo "# nexus-contracts" > "$dir/README.md"
echo "Contracts and API platform docs. Extracted from NEXUS-ENGINE monorepo." >> "$dir/README.md"
(cd "$dir" && git init -q && git add . && git commit -q -m "Initial extraction from NEXUS-ENGINE monorepo" && git branch -M main && git remote add origin "https://github.com/SkTech0/nexus-contracts.git" && git push -u origin main)
echo "Pushed nexus-contracts"

# platform
echo "=== nexus-platform ==="
dir="$WORK/nexus-platform"
rm -rf "$dir"
mkdir -p "$dir"
for p in engine-core gateway-layer orchestration-layer config env scripts infra service-mesh docs; do
  [ -d "$ROOT/$p" ] && cp -R "$ROOT/$p" "$dir/"
done
cp -R "$ROOT/deploy" "$dir/"
echo "# nexus-platform" > "$dir/README.md"
echo "Platform: gateway, orchestration, deploy, config. Extracted from NEXUS-ENGINE monorepo." >> "$dir/README.md"
(cd "$dir" && git init -q && git add . && git commit -q -m "Initial extraction from NEXUS-ENGINE monorepo" && git branch -M main && git remote add origin "https://github.com/SkTech0/nexus-platform.git" && git push -u origin main)
echo "Pushed nexus-platform"

echo "Done. All repos pushed to https://github.com/SkTech0/"
