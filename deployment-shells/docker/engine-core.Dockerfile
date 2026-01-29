# Engine-core service shell — independent deployment.
# Build from repo root: docker build -f deployment-shells/docker/engine-core.Dockerfile .
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY service-shells/engine-core-service service-shells/engine-core-service/
COPY engine-core engine-core/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
RUN npm install -g ts-node typescript 2>/dev/null || npx ts-node --version
ENV ENGINE_CORE_SERVICE_PORT=3001
ENV NODE_ENV=production
EXPOSE 3001
CMD ["npx", "ts-node", "service-shells/engine-core-service/runner.ts"]
