#!/bin/sh
# Test deployed engine services (Railway or any platform).
# Tests each service independently (direct health) and through engine-api (gateway).
#
# Usage:
#   Option A - Set env vars and run:
#     export ENGINE_API_URL="https://your-engine-api.up.railway.app"
#     export ENGINES_AI_URL="https://engine-ai-xxx.up.railway.app"
#     export ENGINES_INTELLIGENCE_URL="https://engine-intelligence-xxx.up.railway.app"
#     export ENGINES_TRUST_URL="https://engine-trust-xxx.up.railway.app"
#     export ENGINES_DATA_URL="https://engine-data-xxx.up.railway.app"
#     export ENGINES_OPTIMIZATION_URL="https://engine-optimization-xxx.up.railway.app"
#     export ENGINES_DISTRIBUTED_URL="https://engine-distributed-xxx.up.railway.app"
#     ./scripts/test-deployed-services.sh
#
#   Option B - Pass engine-api URL only (tests gateway + proxied endpoints):
#     ./scripts/test-deployed-services.sh https://your-engine-api.up.railway.app
#
#   Option C - Pass engine-api URL first, then individual engine URLs:
#     ./scripts/test-deployed-services.sh \
#       https://engine-api.up.railway.app \
#       https://engine-ai.up.railway.app \
#       https://engine-intelligence.up.railway.app \
#       https://engine-trust.up.railway.app \
#       https://engine-data.up.railway.app \
#       https://engine-optimization.up.railway.app \
#       https://engine-distributed.up.railway.app
#./scripts/test-deployed-services.sh \
#  "https://helpful-optimism-production-7709.up.railway.app" \
#  "https://helpful-freedom-production.up.railway.app" \
#  "https://terrific-passion-production-d212.up.railway.app" \
#  "https://responsible-balance-production-930d.up.railway.app" \
#  "https://engine-data-production.up.railway.app" \
#  "https://engine-optimization-production.up.railway.app" \
#  "https://engine-distributed-production.up.railway.app"
# Note: Use -k with curl if your URLs use self-signed certs (e.g. -k flag not needed for Railway).

set -e
API="${1:-$ENGINE_API_URL}"
shift || true

# Optional: individual engine URLs (args 2-7 or env vars)
AI_URL="${1:-$ENGINES_AI_URL}"
INTEL_URL="${2:-$ENGINES_INTELLIGENCE_URL}"
TRUST_URL="${3:-$ENGINES_TRUST_URL}"
DATA_URL="${4:-$ENGINES_DATA_URL}"
OPT_URL="${5:-$ENGINES_OPTIMIZATION_URL}"
DIST_URL="${6:-$ENGINES_DISTRIBUTED_URL}"

CURL="curl -sf -L"
FAILED=0

check() {
  name="$1"
  url="$2"
  if [ -z "$url" ]; then
    echo "  [SKIP] $name — no URL provided"
    return 0
  fi
  if $CURL "$url" >/dev/null 2>&1; then
    echo "  [OK]   $name — $url"
  else
    echo "  [FAIL] $name — $url"
    FAILED=$((FAILED + 1))
  fi
}

# Engine services use /api/X/health or /api/X, not always /health
check_engine() {
  name="$1"
  base="$2"
  path="$3"
  if [ -z "$base" ]; then
    echo "  [SKIP] $name — no URL provided"
    return 0
  fi
  url="${base%/}$path"
  if $CURL "$url" >/dev/null 2>&1; then
    echo "  [OK]   $name — $url"
  else
    echo "  [FAIL] $name — $url"
    FAILED=$((FAILED + 1))
  fi
}

# Try primary path, then /health fallback (some deployments may only expose root /health)
check_engine_with_fallback() {
  name="$1"
  base="$2"
  primary_path="$3"
  if [ -z "$base" ]; then
    echo "  [SKIP] $name — no URL provided"
    return 0
  fi
  url="${base%/}$primary_path"
  if $CURL "$url" >/dev/null 2>&1; then
    echo "  [OK]   $name — $url"
    return 0
  fi
  url="${base%/}/health"
  if $CURL "$url" >/dev/null 2>&1; then
    echo "  [OK]   $name — $url (fallback)"
    return 0
  fi
  echo "  [FAIL] $name — ${base%/}$primary_path and $url both failed"
  FAILED=$((FAILED + 1))
}

check_json() {
  name="$1"
  url="$2"
  if [ -z "$url" ]; then
    echo "  [SKIP] $name — no URL provided"
    return 0
  fi
  out=$($CURL -s "$url" 2>/dev/null) || true
  if echo "$out" | grep -q '"status"'; then
    echo "  [OK]   $name — $url"
  else
    echo "  [FAIL] $name — $url (no valid JSON or status)"
    FAILED=$((FAILED + 1))
  fi
}

echo "=========================================="
echo "  Deployed services test"
echo "=========================================="
echo ""

# ---- 1. Direct health checks (each engine independently) ----
echo "1) Direct engine health (each service independently)"
echo "   GET /api/X/health on each engine base URL"
echo ""
check_engine "engine-ai"         "$AI_URL" "/api/AI/health"
check_engine "engine-intelligence" "$INTEL_URL" "/api/Intelligence/health"
check_engine "engine-trust"      "$TRUST_URL" "/api/Trust/health"
check_engine_with_fallback "engine-data"       "$DATA_URL" "/api/Data/health"
check_engine "engine-optimization" "$OPT_URL" "/api/Optimization/health"
check_engine_with_fallback "engine-distributed" "$DIST_URL" "/api/Distributed/health"
echo ""

# ---- 2. engine-api gateway ----
if [ -n "$API" ]; then
  echo "2) engine-api gateway"
  echo "   GET /api/Health"
  check_json "engine-api health" "${API}/api/Health"
  echo ""

  echo "3) Through gateway (engine-api proxies to engines)"
  echo "   These verify engine-api → remote engines wiring"
  echo ""
  check_json "Engine status"   "${API}/api/Engine"
  check_json "AI health"       "${API}/api/AI/health"
  check_json "Intelligence"    "${API}/api/Intelligence/health"
  check_json "Optimization"    "${API}/api/Optimization/health"
  check_json "Trust health"    "${API}/api/Trust/health"
  echo ""

  echo "4) Functional endpoints (POST)"
  echo ""
  # Engine execute
  out=$($CURL -s -X POST "${API}/api/Engine/execute" -H "Content-Type: application/json" -d '{"action":"ping","parameters":{}}' 2>/dev/null) || out=""
  if echo "$out" | grep -q '"status"'; then
    echo "  [OK]   POST /api/Engine/execute"
  else
    echo "  [FAIL] POST /api/Engine/execute"
    FAILED=$((FAILED + 1))
  fi

  # Intelligence evaluate
  out=$($CURL -s -X POST "${API}/api/Intelligence/evaluate" -H "Content-Type: application/json" -d '{"context":"test","inputs":{"k":"v"}}' 2>/dev/null) || out=""
  if echo "$out" | grep -q '"outcome"'; then
    echo "  [OK]   POST /api/Intelligence/evaluate"
  else
    echo "  [FAIL] POST /api/Intelligence/evaluate"
    FAILED=$((FAILED + 1))
  fi

  # Optimization optimize
  out=$($CURL -s -X POST "${API}/api/Optimization/optimize" -H "Content-Type: application/json" -d '{"targetId":"t1","objective":"min","constraints":{}}' 2>/dev/null) || out=""
  if echo "$out" | grep -q '"targetId"'; then
    echo "  [OK]   POST /api/Optimization/optimize"
  else
    echo "  [FAIL] POST /api/Optimization/optimize"
    FAILED=$((FAILED + 1))
  fi

  # AI infer
  out=$($CURL -s -X POST "${API}/api/AI/infer" -H "Content-Type: application/json" -d '{"modelId":"default","inputs":{"x":1}}' 2>/dev/null) || out=""
  if echo "$out" | grep -q '"outputs"'; then
    echo "  [OK]   POST /api/AI/infer"
  else
    echo "  [FAIL] POST /api/AI/infer"
    FAILED=$((FAILED + 1))
  fi

  # Trust verify
  out=$($CURL -s -X POST "${API}/api/Trust/verify" -H "Content-Type: application/json" -d '{"claimType":"test","payload":{}}' 2>/dev/null) || out=""
  if echo "$out" | grep -q '"valid"'; then
    echo "  [OK]   POST /api/Trust/verify"
  else
    echo "  [FAIL] POST /api/Trust/verify"
    FAILED=$((FAILED + 1))
  fi

  echo ""
else
  echo "2) Skipping engine-api tests — no ENGINE_API_URL or first argument"
  echo ""
fi

echo "=========================================="
if [ "$FAILED" -gt 0 ]; then
  echo "  Result: $FAILED check(s) FAILED"
  echo "=========================================="
  exit 1
else
  echo "  Result: All checks passed"
  echo "=========================================="
  exit 0
fi
