# Product UI — Railway deployment.
# Build context: repo root. Railway root directory = repo root, dockerfile path = deploy/railway/product-ui/Dockerfile.
# Set SAAS_API_URL build-arg to your saas-api public URL (e.g. https://saas-api-xxx.up.railway.app).
FROM node:20-slim AS build
WORKDIR /app
ARG SAAS_API_URL=/api/saas
COPY package.json package-lock.json* nx.json tsconfig.base.json angular.json ./
COPY engine-core engine-core/
COPY engine-distributed engine-distributed/
COPY engine-data engine-data/
COPY engine-intelligence engine-intelligence/
COPY engine-optimization engine-optimization/
COPY engine-trust engine-trust/
COPY saas-layer saas-layer/
COPY product-ui product-ui/
# Replace __SAAS_API_URL__ placeholder with build-arg value
RUN sed -i "s|__SAAS_API_URL__|${SAAS_API_URL}|g" product-ui/src/environments/environment.prod.ts
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm ci --ignore-scripts
RUN npx ng build product-ui --configuration=production

FROM nginx:alpine
COPY --from=build /app/product-ui/dist/product-ui/browser /usr/share/nginx/html
COPY deploy/railway/product-ui/nginx.railway.conf /etc/nginx/conf.d/default.conf.template
# Railway sets PORT; nginx must listen on it. Replace 8080 with $PORT at startup.
EXPOSE 8080
CMD ["sh", "-c", "sed \"s/8080/${PORT:-8080}/\" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
