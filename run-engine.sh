#!/bin/sh
# Run engine flow + API smoke tests. Requires engine-api running.
# Usage: ./run-engine.sh [BASE_URL]

set -e
cd "$(dirname "$0")"
BASE="${1:-http://localhost:5000}"

echo "=== Engine flow ==="
./scripts/test-engine-flow.sh "$BASE"
echo "=== API smoke ==="
./scripts/test-api.sh "$BASE"
echo "=== run-engine complete ==="
