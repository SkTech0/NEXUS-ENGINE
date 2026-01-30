FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    nginx \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN chmod +x run-all.sh run-engine-services.sh run-api-with-engines.sh deploy/railway/start.sh

EXPOSE 10021

CMD ["deploy/railway/start.sh"]
