# engine-data-service

Independent service wrapping engine-data.

## Responsibility

- Wraps engine-data
- Exposes: `/api/Data/query`, `/api/Data/index`, `/health`
- Independent deployment, scaling, failure domain

## Local run

```bash
python run.py
```
Default port: 5015.
