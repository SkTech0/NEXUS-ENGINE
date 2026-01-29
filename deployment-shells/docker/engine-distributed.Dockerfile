# Engine-distributed service shell — independent deployment.
# Build from repo root: docker build -f deployment-shells/docker/engine-distributed.Dockerfile .
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY service-shells/engine-distributed-service service-shells/engine-distributed-service/
COPY engine-distributed engine-distributed/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_DISTRIBUTED_SERVICE_PORT=3007
ENV NODE_ENV=production
EXPOSE 3007
CMD ["npx", "ts-node", "service-shells/engine-distributed-service/runner.ts"]
