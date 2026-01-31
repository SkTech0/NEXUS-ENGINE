#!/bin/sh
# Run engine-api with real engines (engine-services must be running on port 5002).
# Start engine-services first: ./run-engine-services.sh
# Then run this script, and optionally product-ui: npx nx serve product-ui
# Usage: ./run-api-with-engines.sh

set -e
cd "$(dirname "$0")"
export Engines__BaseUrl="http://localhost:5002"
./run-api.sh
