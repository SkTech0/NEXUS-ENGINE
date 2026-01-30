# engine-ai-service — independent service image
# Additive; does not replace engine-ai or engine-services.
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONPATH=/app
EXPOSE 5011

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5011"]
