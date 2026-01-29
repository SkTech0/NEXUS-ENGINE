#!/bin/sh
# Test engine-api endpoints (run after: cd engine-api && dotnet run --project src/EngineApi/EngineApi.csproj)
# Use HTTP and follow redirects, or use HTTPS (may need -k if self-signed cert)

BASE="${1:-http://localhost:5000}"

echo "=== Health ==="
curl -s -L "$BASE/api/Health" | head -c 500
echo -e "\n"

echo "=== Swagger JSON (first 300 chars) ==="
curl -s -L "$BASE/swagger/v1/swagger.json" | head -c 300
echo -e "\n"

echo "=== Engine status ==="
curl -s -L "$BASE/api/Engine" | head -c 500
echo -e "\n"

echo "Done. Swagger UI: $BASE/swagger  (use https://localhost:5001/swagger if running locally with HTTPS)"
