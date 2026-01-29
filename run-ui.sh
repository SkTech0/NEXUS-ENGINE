#!/bin/sh
# Serve product-ui. Usage: ./run-ui.sh

set -e
cd "$(dirname "$0")"
npx nx serve product-ui 2>/dev/null || npx ng serve product-ui 2>/dev/null
