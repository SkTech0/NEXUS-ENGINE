# engine-intelligence — Python service. Build context: repo root.
FROM python:3.11-slim
WORKDIR /app
COPY services/engine-intelligence-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY engine-intelligence/ /app/engine-intelligence/
COPY services/engine-intelligence-service/ .
ENV PYTHONPATH=/app:/app/engine-intelligence
EXPOSE 8080
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
