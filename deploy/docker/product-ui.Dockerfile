# Product-UI — independent deployment (static build + nginx).
# Build from repo root: docker build -f deploy/docker/product-ui.Dockerfile .
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json* nx.json tsconfig.base.json angular.json ./
COPY engines/engine-core engines/engine-core/
COPY engines/engine-distributed engines/engine-distributed/
COPY engines/engine-data engines/engine-data/
COPY engines/engine-intelligence engines/engine-intelligence/
COPY engines/engine-optimization engines/engine-optimization/
COPY engines/engine-trust engines/engine-trust/
COPY engines/saas-layer engines/saas-layer/
COPY apps/product-ui apps/product-ui/
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm ci --ignore-scripts
RUN npx ng build product-ui --configuration=production

FROM nginx:alpine
COPY --from=build /app/apps/product-ui/dist/product-ui/browser /usr/share/nginx/html
COPY apps/product-ui/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
