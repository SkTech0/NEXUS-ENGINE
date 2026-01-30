# engine-ai-service

Independent service wrapping engine-ai. Part of NEXUS SEP (Service Extraction Phase).

## Responsibility

- Wraps engine-ai
- Exposes: `/api/AI/infer`, `/api/AI/train`, `/health`
- Independent deployment, scaling, failure domain, config, observability

## Local run

```bash
python run.py
# or
uvicorn app.main:app --host 0.0.0.0 --port 5011
```

## Port

Default: 5011 (override via `ENGINE_AI_SERVICE_PORT`).
