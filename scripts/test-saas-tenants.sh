#!/bin/bash
# Test SaaS API and Tenants integration.
# Usage:
#   ./scripts/test-saas-tenants.sh [SAAS_API_BASE_URL]
#   Default: https://saas-api-production-8be1.up.railway.app/api/saas

BASE="${1:-https://saas-api-production-8be1.up.railway.app/api/saas}"
CURL="curl -sf -L"

echo "=========================================="
echo "  SaaS API + Tenants test"
echo "  Base URL: $BASE"
echo "=========================================="
echo ""

echo "1) Health"
$CURL "$BASE/health" | head -c 200
echo -e "\n"

echo "2) List tenants"
$CURL "$BASE/tenants" | head -c 500
echo -e "\n"

echo "3) Create tenant"
$CURL -X POST "$BASE/tenants" -H "Content-Type: application/json" \
  -d '{"id":"smoke-test","name":"Smoke Test","plan":"default"}' | head -c 300
echo -e "\n"

echo "4) List tenants again"
$CURL "$BASE/tenants" | head -c 500
echo -e "\n"

echo "=========================================="
echo "  Done. Visit product-ui /tenants to see in UI."
echo "=========================================="
