#!/bin/sh
# AI engine tests — pytest engine-ai + optional /api/AI checks.
# Usage: ./scripts/test-ai.sh
# Optional: ENGINE_API_URL=http://localhost:5000 to also hit /api/AI/infer.

set -e
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

echo "=== AI Engine Tests ==="

if command -v python3 >/dev/null 2>&1; then
  (cd "$ROOT" && python3 -m pip install -q -r requirements-test.txt 2>/dev/null || true)
  (cd "$ROOT/engine-ai" && python3 -m pytest tests/ -v --tb=short 2>&1) || {
    echo "pytest failed. Install: pip install -r requirements-test.txt" >&2
    exit 1
  }
else
  echo "python3 not found. Install Python 3 and: pip install -r requirements-test.txt" >&2
  exit 1
fi

BASE="${ENGINE_API_URL:-}"
if [ -n "$BASE" ]; then
  echo ""
  echo "=== AI API checks ==="
  curl -sf -L "$BASE/api/AI/health" >/dev/null && echo "AI health OK" || true
  curl -sf -L -X POST "$BASE/api/AI/infer" \
    -H "Content-Type: application/json" \
    -d '{"modelId":"default","inputs":{"x":1}}' | head -c 300
  echo -e "\n"
fi

echo "=== AI tests complete ==="
