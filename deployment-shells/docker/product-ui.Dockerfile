# Product-UI — independent deployment (static build + nginx).
# Build from repo root: docker build -f deployment-shells/docker/product-ui.Dockerfile .
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json* nx.json tsconfig.base.json angular.json ./
COPY engine-core engine-core/
COPY engine-distributed engine-distributed/
COPY engine-data engine-data/
COPY engine-intelligence engine-intelligence/
COPY engine-optimization engine-optimization/
COPY engine-trust engine-trust/
COPY saas-layer saas-layer/
COPY product-ui product-ui/
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm ci --ignore-scripts
RUN npx ng build product-ui --configuration=production

FROM nginx:alpine
COPY --from=build /app/product-ui/dist/product-ui/browser /usr/share/nginx/html
COPY product-ui/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
