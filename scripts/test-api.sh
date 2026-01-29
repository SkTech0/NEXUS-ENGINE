#!/bin/sh
# API smoke test — Health, Swagger, Engine. Requires engine-api running.
# Usage: ./scripts/test-api.sh [BASE_URL]
# Default: http://localhost:5000

BASE="${1:-http://localhost:5000}"
set -e

echo "=== API Smoke Test ==="
echo "Base URL: $BASE"
echo ""

echo "1) Health"
curl -sf -L "$BASE/api/Health" | head -c 500
echo -e "\n"

echo "2) Swagger JSON (preview)"
curl -sf -L "$BASE/swagger/v1/swagger.json" | head -c 300
echo -e "\n"

echo "3) Engine status"
curl -sf -L "$BASE/api/Engine" | head -c 500
echo -e "\n"

echo "4) Engine execute"
curl -sf -L -X POST "$BASE/api/Engine/execute" \
  -H "Content-Type: application/json" \
  -d '{"action":"ping","parameters":{}}' | head -c 500
echo -e "\n"

echo "=== API smoke test complete ==="
