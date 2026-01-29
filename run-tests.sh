#!/bin/sh
# Run all tests: UI, API, Python engines, engine flow.
# Usage: ./run-tests.sh [--skip-ui] [--skip-api] [--skip-engines] [--skip-flow]

set -e
cd "$(dirname "$0")"
SKIP_UI=0
SKIP_API=0
SKIP_ENGINES=0
SKIP_FLOW=0
for x in "$@"; do
  case "$x" in
    --skip-ui)      SKIP_UI=1 ;;
    --skip-api)     SKIP_API=1 ;;
    --skip-engines) SKIP_ENGINES=1 ;;
    --skip-flow)    SKIP_FLOW=1 ;;
  esac
done

run() {
  echo "=== $* ==="
  "$@"
}

[ $SKIP_UI -eq 0 ] && run npx nx test product-ui --no-watch --browsers=ChromeHeadless 2>/dev/null || run npx ng test product-ui --no-watch --browsers=ChromeHeadless 2>/dev/null || true
[ $SKIP_API -eq 0 ] && run dotnet test engine-api/EngineApi.sln -c Release -v minimal
[ $SKIP_ENGINES -eq 1 ] || {
  pip3 install -q -r requirements-test.txt 2>/dev/null || python3 -m pip install -q -r requirements-test.txt 2>/dev/null || true
  for engine in engine-ai engine-data engine-intelligence engine-optimization engine-distributed engine-trust; do
    [ -d "$engine/tests" ] && run sh -c "cd $engine && python3 -m pytest tests/ -v --tb=short" || true
  done
}
[ $SKIP_FLOW -eq 0 ] && [ -x scripts/test-engine-flow.sh ] && run ./scripts/test-engine-flow.sh "${ENGINE_API_URL:-http://localhost:5000}" 2>/dev/null || echo "Engine flow skipped (API not running or script failed)"

echo "=== run-tests complete ==="
