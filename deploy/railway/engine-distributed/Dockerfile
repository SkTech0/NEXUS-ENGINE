# engine-distributed — Python service. Build context: repo root.
# Includes engine-distributed domain for replication, coordination, consensus.
FROM python:3.11-slim
WORKDIR /app
COPY services/engine-distributed-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY engine-distributed/ engine-distributed/
COPY services/engine-distributed-service/ .
ENV PYTHONPATH=/app:/app/engine-distributed
EXPOSE 8080
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
