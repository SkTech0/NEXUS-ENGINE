#!/bin/sh
# Load test — k6 or fallback to curl loop.
# Usage: ./scripts/load-test.sh [BASE_URL] [DURATION_SEC] [VUS]
# Defaults: BASE_URL=http://localhost:5000, DURATION_SEC=30, VUS=5

BASE="${1:-http://localhost:5000}"
DURATION="${2:-30}"
VUS="${3:-5}"
set -e
cd "$(dirname "$0")/.."
SCRIPT_DIR="$(pwd)/scripts"

echo "=== Load Test ==="
echo "Base URL: $BASE"
echo "Duration: ${DURATION}s, VUs: $VUS"
echo ""

if command -v k6 >/dev/null 2>&1; then
  echo "Using k6..."
  k6 run -e BASE_URL="$BASE" -e DURATION="$DURATION" -e VUS="$VUS" \
    "$SCRIPT_DIR/load-test-k6.js" 2>&1 || true
else
  echo "k6 not found. Running curl-based load (duration ${DURATION}s, ~${VUS} req/s)..."
  end=$(($(date +%s) + DURATION))
  count=0
  while [ "$(date +%s)" -lt "$end" ]; do
    i=0
    while [ $i -lt $VUS ]; do
      curl -sf -L "$BASE/api/Health" >/dev/null 2>&1 || true
      count=$((count + 1))
      i=$((i + 1))
    done
    sleep 1
  done
  echo "Completed ~$count requests."
fi

echo "=== Load test complete ==="
