# Engine-ai service shell — independent deployment (Node + Python).
# Build from repo root: docker build -f deployment-shells/docker/engine-ai.Dockerfile .
FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
COPY service-shells/engine-ai-service service-shells/engine-ai-service/
COPY engine-ai engine-ai/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_AI_SERVICE_PORT=3002
ENV NODE_ENV=production
EXPOSE 3002
CMD ["npx", "ts-node", "service-shells/engine-ai-service/runner.ts"]
