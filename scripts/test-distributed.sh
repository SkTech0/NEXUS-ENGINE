#!/bin/sh
# Distributed engine tests — pytest engine-distributed + optional API checks.
# Usage: ./scripts/test-distributed.sh
# Optional: ENGINE_API_URL=http://localhost:5000 to also curl distributed-related endpoints.

set -e
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

echo "=== Distributed Engine Tests ==="

if command -v python3 >/dev/null 2>&1; then
  (cd "$ROOT" && python3 -m pip install -q -r requirements-test.txt 2>/dev/null || true)
  (cd "$ROOT/engine-distributed" && python3 -m pytest tests/ -v --tb=short 2>&1) || {
    echo "pytest failed; run: pip install -r requirements-test.txt" >&2
    exit 1
  }
else
  echo "python3 not found. Install Python 3 and: pip install -r requirements-test.txt" >&2
  exit 1
fi

BASE="${ENGINE_API_URL:-}"
if [ -n "$BASE" ]; then
  echo ""
  echo "=== Distributed-related API checks ==="
  curl -sf -L "$BASE/api/Health" >/dev/null && echo "Health OK" || true
  curl -sf -L -X POST "$BASE/api/Engine/execute" \
    -H "Content-Type: application/json" \
    -d '{"action":"push","parameters":{"source":"distributed-test"}}' >/dev/null && echo "Engine execute OK" || true
fi

echo "=== Distributed tests complete ==="
