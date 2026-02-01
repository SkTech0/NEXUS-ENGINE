# SaaS API — Railway deployment. Build context: repo root.
# Exposes saas-layer (tenants, usage) over HTTP.
FROM python:3.11-slim
WORKDIR /app
COPY saas-layer ./saas-layer
COPY services/saas-api-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY services/saas-api-service/ ./
ENV PYTHONPATH=/app/saas-layer:/app
EXPOSE 8080
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
