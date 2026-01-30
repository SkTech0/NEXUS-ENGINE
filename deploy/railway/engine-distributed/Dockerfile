# engine-distributed — Python service. Build context: repo root.
FROM python:3.11-slim
WORKDIR /app
COPY services/engine-distributed-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY services/engine-distributed-service/ .
ENV PYTHONPATH=/app
EXPOSE 8080
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
