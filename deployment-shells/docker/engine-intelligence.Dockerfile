# Engine-intelligence service shell — independent deployment.
# Build from repo root: docker build -f deployment-shells/docker/engine-intelligence.Dockerfile .
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY service-shells/engine-intelligence-service service-shells/engine-intelligence-service/
COPY engine-intelligence engine-intelligence/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_INTELLIGENCE_SERVICE_PORT=3004
ENV NODE_ENV=production
EXPOSE 3004
CMD ["npx", "ts-node", "service-shells/engine-intelligence-service/runner.ts"]
