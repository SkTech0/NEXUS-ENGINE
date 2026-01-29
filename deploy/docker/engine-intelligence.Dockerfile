# Engine-intelligence service shell — independent deployment.
# Build from repo root: docker build -f deploy/docker/engine-intelligence.Dockerfile .
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY platform-runtime/service-shells/engine-intelligence-service platform-runtime/service-shells/engine-intelligence-service/
COPY engines/engine-intelligence engines/engine-intelligence/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_INTELLIGENCE_SERVICE_PORT=3004
ENV NODE_ENV=production
EXPOSE 3004
CMD ["npx", "ts-node", "platform-runtime/service-shells/engine-intelligence-service/runner.ts"]
