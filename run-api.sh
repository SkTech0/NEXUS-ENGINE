#!/bin/sh
# Run engine-api. Usage: ./run-api.sh

set -e
cd "$(dirname "$0")"
dotnet run --project engine-api/src/EngineApi/EngineApi.csproj
