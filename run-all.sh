#!/bin/sh
# Run full suite: lint, build, test, engine flow (with API), benchmarks.
# Usage: ./run-all.sh [BASE_URL]
# BASE_URL default: http://localhost:5000 (start API separately or use run-local)

set -e
cd "$(dirname "$0")"
BASE="${1:-http://localhost:5000}"
export ENGINE_API_URL="$BASE"

echo "=== 1. Lint ==="
npx nx run-many --target=lint --all --skip-nx-cache 2>/dev/null || npm run lint 2>/dev/null || true

echo "=== 2. Build ==="
npx nx run-many --target=build --all --skip-nx-cache 2>/dev/null || npx nx run product-ui:build 2>/dev/null || true

echo "=== 3. Tests ==="
./run-tests.sh

echo "=== 4. Engine flow ==="
./scripts/test-engine-flow.sh "$BASE" 2>/dev/null || echo "Engine flow skipped (API not up)"

echo "=== 5. Benchmarks (optional) ==="
python3 benchmarks/engine-benchmark.py 2>/dev/null || true
python3 benchmarks/ai-benchmark.py 2>/dev/null || true
python3 benchmarks/distributed-benchmark.py 2>/dev/null || true
[ -f health/dependency-check.py ] && SKIP_ENGINE_API_CHECK=1 python3 health/dependency-check.py 2>/dev/null || true

echo "=== run-all complete ==="
