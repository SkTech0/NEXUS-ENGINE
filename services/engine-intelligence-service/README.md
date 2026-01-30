# engine-intelligence-service

Independent service wrapping engine-intelligence.

## Responsibility

- Wraps engine-intelligence
- Exposes: `/api/Intelligence/evaluate`, `/api/Engine/execute`, `/health`
- Independent deployment, scaling, failure domain

## Local run

```bash
python run.py
```
Default port: 5012.
