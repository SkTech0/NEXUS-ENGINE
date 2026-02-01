#!/bin/sh
# Engine Test Flow: Data → Intelligence → Optimization → AI → API → UI
# Run with engine-api up: cd engine-api && dotnet run --project src/EngineApi/EngineApi.csproj
# Usage: ./scripts/test-engine-flow.sh [BASE_URL]
# Default: http://localhost:5000

BASE="${1:-http://localhost:5000}"
set -e

echo "=== Engine Test Flow ==="
echo "Base URL: $BASE"
echo ""

echo "1) Health"
curl -s -L "$BASE/api/Health" | head -c 200
echo -e "\n"

echo "2) Engine status (gateway)"
curl -s -L "$BASE/api/Engine" | head -c 300
echo -e "\n"

echo "3) Push data (Engine/execute)"
curl -s -L -X POST "$BASE/api/Engine/execute" \
  -H "Content-Type: application/json" \
  -d '{"action":"push","parameters":{"source":"test-flow"}}' | head -c 300
echo -e "\n"

echo "4) Intelligence evaluate"
curl -s -L -X POST "$BASE/api/Intelligence/evaluate" \
  -H "Content-Type: application/json" \
  -d '{"context":"test-flow","inputs":{"key":"value"}}' | head -c 300
echo -e "\n"

echo "5) Optimization optimize (loan_approval + generic)"
curl -s -L -X POST "$BASE/api/Optimization/optimize" \
  -H "Content-Type: application/json" \
  -d '{"targetId":"loan_approval","objective":"maximize","constraints":{"creditScore":750,"incomeToLoan":0.3,"existingLoans":1}}' | head -c 300
echo -e "\n"

echo "6) AI infer"
curl -s -L -X POST "$BASE/api/AI/infer" \
  -H "Content-Type: application/json" \
  -d '{"modelId":"default","inputs":{"x":1}}' | head -c 300
echo -e "\n"

echo "7) Trust health (optional)"
curl -s -L "$BASE/api/Trust/health" | head -c 200
echo -e "\n"

echo "=== Flow complete ==="
echo "UI: serve product-ui and open http://localhost:4200 to visualize."
