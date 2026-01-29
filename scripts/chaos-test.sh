#!/bin/sh
# Chaos test — fault injection patterns (Chaos Mesh–style).
# Use with k8s + Chaos Mesh for full chaos; otherwise runs lightweight local checks.
# Usage: ./scripts/chaos-test.sh [BASE_URL]
# BASE_URL: engine-api base (default http://localhost:5000).

BASE="${1:-http://localhost:5000}"
set -e
cd "$(dirname "$0")/.."

echo "=== Chaos Test (lightweight) ==="
echo "Base URL: $BASE"
echo ""

# 1) Pre-chaos baseline
echo "1) Baseline: Health check"
curl -sf -L "$BASE/api/Health" >/dev/null && echo "  OK" || { echo "  FAIL (API down?)"; exit 1; }

# 2) Rapid repeated requests (stress)
echo "2) Stress: 10x Health"
i=0
while [ $i -lt 10 ]; do
  curl -sf -L "$BASE/api/Health" >/dev/null || true
  i=$((i + 1))
done
echo "  OK"

# 3) Concurrent-like burst (sequential burst)
echo "3) Burst: 5x Engine execute"
i=0
while [ $i -lt 5 ]; do
  curl -sf -L -X POST "$BASE/api/Engine/execute" \
    -H "Content-Type: application/json" \
    -d '{"action":"chaos-burst","parameters":{}}' >/dev/null || true
  i=$((i + 1))
done
echo "  OK"

# 4) Post-stress Health
echo "4) Post-stress: Health"
curl -sf -L "$BASE/api/Health" >/dev/null && echo "  OK" || { echo "  FAIL"; exit 1; }

echo ""
echo "=== Chaos (lightweight) complete ==="
echo "For full chaos: run Chaos Mesh experiments in-cluster (pod kill, net delay, etc.)."
