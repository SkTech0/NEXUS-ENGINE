# Engine-distributed service shell — independent deployment.
# Build from repo root: docker build -f deploy/docker/engine-distributed.Dockerfile .
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY platform-runtime/service-shells/engine-distributed-service platform-runtime/service-shells/engine-distributed-service/
COPY engines/engine-distributed engines/engine-distributed/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_DISTRIBUTED_SERVICE_PORT=3007
ENV NODE_ENV=production
EXPOSE 3007
CMD ["npx", "ts-node", "platform-runtime/service-shells/engine-distributed-service/runner.ts"]
