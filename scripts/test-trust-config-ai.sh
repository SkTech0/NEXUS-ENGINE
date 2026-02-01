#!/bin/sh
# Test Trust Verify, Config, AI Training endpoints.
# Usage: ./scripts/test-trust-config-ai.sh [TRUST_URL] [AI_URL]
# Default: Trust=localhost:5014, AI=localhost:5011 (or pass engine-api URL to test gateway)

TRUST="${1:-http://localhost:5014}"
AI="${2:-http://localhost:5011}"
set -e

echo "=== Trust Verify & AI Training Tests ==="
echo "Trust: $TRUST | AI: $AI"
echo ""

echo "1) Trust health"
curl -sf "$TRUST/health" | head -c 200
echo ""

echo "2) Trust verify (no token)"
curl -sf -X POST "$TRUST/api/Trust/verify" -H "Content-Type: application/json" -d '{}' || true
echo ""

echo "3) Trust verify (invalid token)"
curl -sf -X POST "$TRUST/api/Trust/verify" -H "Content-Type: application/json" -d '{"payload":{"token":"invalid"}}' || true
echo ""

echo "4) AI train submit"
TRAIN_RES=$(curl -sf -X POST "$AI/api/AI/train" -H "Content-Type: application/json" -d '{}')
echo "$TRAIN_RES"
JOB_ID=$(echo "$TRAIN_RES" | grep -o '"jobId":"[^"]*"' | cut -d'"' -f4)
echo ""

if [ -n "$JOB_ID" ]; then
  echo "5) AI train status (job=$JOB_ID)"
  sleep 2
  curl -sf "$AI/api/AI/train/$JOB_ID/status" || true
  echo ""
fi

echo "6) AI infer"
curl -sf -X POST "$AI/api/AI/infer" -H "Content-Type: application/json" -d '{"modelId":"default","inputs":{"x":1}}' | head -c 200
echo ""

echo "=== Done ==="
