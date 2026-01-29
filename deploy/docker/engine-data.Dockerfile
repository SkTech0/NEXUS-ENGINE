# Engine-data service shell — independent deployment.
# Build from repo root: docker build -f deploy/docker/engine-data.Dockerfile .
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY platform-runtime/service-shells/engine-data-service platform-runtime/service-shells/engine-data-service/
COPY engines/engine-data engines/engine-data/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_DATA_SERVICE_PORT=3003
ENV NODE_ENV=production
EXPOSE 3003
CMD ["npx", "ts-node", "platform-runtime/service-shells/engine-data-service/runner.ts"]
