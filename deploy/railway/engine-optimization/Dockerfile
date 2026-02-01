# engine-optimization — Python service. Build context: repo root.
# Includes engine-optimization domain for solvers, heuristics, schedulers, allocators.
FROM python:3.11-slim
WORKDIR /app
COPY services/engine-optimization-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY engine-optimization/ engine-optimization/
COPY services/engine-optimization-service/ .
ENV PYTHONPATH=/app:/app/engine-optimization
EXPOSE 8080
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
