# Engine-optimization service shell — independent deployment.
# Build from repo root: docker build -f deployment-shells/docker/engine-optimization.Dockerfile .
FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
COPY service-shells/engine-optimization-service service-shells/engine-optimization-service/
COPY engine-optimization engine-optimization/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_OPTIMIZATION_SERVICE_PORT=3005
ENV NODE_ENV=production
EXPOSE 3005
CMD ["npx", "ts-node", "service-shells/engine-optimization-service/runner.ts"]
