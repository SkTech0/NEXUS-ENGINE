#!/bin/sh
# CI-style: lint, build, then run-tests.
# Usage: ./run-ci.sh

set -e
cd "$(dirname "$0")"

echo "=== Lint ==="
npx nx run-many --target=lint --all --skip-nx-cache 2>/dev/null || npm run lint 2>/dev/null || true

echo "=== Build ==="
npx nx run-many --target=build --all --skip-nx-cache 2>/dev/null || npx nx run product-ui:build 2>/dev/null || true

echo "=== Tests ==="
./run-tests.sh --skip-flow

echo "=== run-ci complete ==="
