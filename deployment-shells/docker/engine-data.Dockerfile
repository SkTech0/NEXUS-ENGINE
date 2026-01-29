# Engine-data service shell — independent deployment.
# Build from repo root: docker build -f deployment-shells/docker/engine-data.Dockerfile .
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY service-shells/engine-data-service service-shells/engine-data-service/
COPY engine-data engine-data/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_DATA_SERVICE_PORT=3003
ENV NODE_ENV=production
EXPOSE 3003
CMD ["npx", "ts-node", "service-shells/engine-data-service/runner.ts"]
