#!/bin/sh
# Data engine tests — pytest engine-data.
# Usage: ./scripts/test-data.sh

set -e
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

echo "=== Data Engine Tests ==="

if command -v python3 >/dev/null 2>&1; then
  (cd "$ROOT" && python3 -m pip install -q -r requirements-test.txt 2>/dev/null || true)
  (cd "$ROOT/engine-data" && python3 -m pytest tests/ -v --tb=short 2>&1) || {
    echo "pytest failed. Install: pip install -r requirements-test.txt" >&2
    exit 1
  }
else
  echo "python3 not found. Install Python 3 and: pip install -r requirements-test.txt" >&2
  exit 1
fi

echo "=== Data tests complete ==="
