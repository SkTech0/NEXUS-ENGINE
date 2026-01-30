FROM node:20-alpine

RUN apk add --no-cache bash curl nginx

WORKDIR /app

COPY engine-api ./engine-api
COPY engine-core ./engine-core
COPY engine-ai ./engine-ai
COPY engine-data ./engine-data
COPY engine-intelligence ./engine-intelligence
COPY engine-trust ./engine-trust
COPY engine-optimization ./engine-optimization
COPY engine-distributed ./engine-distributed

RUN printf '%s\n' '#!/bin/sh' 'set -e' 'cd "$(dirname "$0")"' 'export Engines__BaseUrl="http://localhost:5001"' 'dotnet run --project engine-api/src/EngineApi/EngineApi.csproj --urls "http://0.0.0.0:10021"' > /app/run-api-with-engines.sh && \
    printf '%s\n' '#!/bin/sh' 'echo "NEXUS-ENGINE Platform Preview"' 'echo "ERL-4 Deployment Mode"' './run-api-with-engines.sh' > /app/start.sh && \
    chmod +x /app/start.sh /app/run-api-with-engines.sh

EXPOSE 10021

CMD ["/app/start.sh"]
