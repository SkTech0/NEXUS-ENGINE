#!/bin/sh
# Run local dev stack: API + UI (optional). Use for local E2E / engine flow.
# Usage: ./run-local.sh [--api-only | --ui-only]

set -e
cd "$(dirname "$0")"
API_ONLY=0
UI_ONLY=0
for x in "$@"; do
  case "$x" in
    --api-only) API_ONLY=1 ;;
    --ui-only)  UI_ONLY=1 ;;
  esac
done

if [ $UI_ONLY -eq 1 ]; then
  echo "=== Serving UI ==="
  npx nx serve product-ui 2>/dev/null || npx ng serve product-ui 2>/dev/null
  exit 0
fi

if [ $API_ONLY -eq 1 ]; then
  echo "=== Running API ==="
  dotnet run --project engine-api/src/EngineApi/EngineApi.csproj
  exit 0
fi

echo "=== API (background) + UI ==="
dotnet run --project engine-api/src/EngineApi/EngineApi.csproj &
API_PID=$!
sleep 5
npx nx serve product-ui 2>/dev/null || npx ng serve product-ui 2>/dev/null &
UI_PID=$!
trap "kill $API_PID $UI_PID 2>/dev/null" EXIT
wait
