# Engine-trust service shell — independent deployment.
# Build from repo root: docker build -f deployment-shells/docker/engine-trust.Dockerfile .
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
COPY service-shells/engine-trust-service service-shells/engine-trust-service/
COPY engine-trust engine-trust/
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts
ENV ENGINE_TRUST_SERVICE_PORT=3006
ENV NODE_ENV=production
EXPOSE 3006
CMD ["npx", "ts-node", "service-shells/engine-trust-service/runner.ts"]
