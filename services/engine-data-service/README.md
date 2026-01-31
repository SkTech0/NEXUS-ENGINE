# engine-data-service

Independent service wrapping engine-data.

## Responsibility

- Wraps engine-data
- Exposes: `/api/Data/query`, `/api/Data/index`, `/health`
- Independent deployment, scaling, failure domain

## Local run

From this directory (with repo layout intact, so `../../engine-data` exists), the service auto-adds `engine-data` to the path and wires the domain:

```bash
cd services/engine-data-service
python run.py
```
Default port: 5015. If `engine-data` is not on `PYTHONPATH` and the repo layout is not present, health still responds; index/query return ENGINE_UNAVAILABLE.
