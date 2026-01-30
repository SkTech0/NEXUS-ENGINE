# engine-distributed-service

Independent service wrapping engine-distributed.

## Responsibility

- Wraps engine-distributed
- Exposes: `/api/Distributed/replicate`, `/api/Distributed/coordinate`, `/health`
- Independent deployment, scaling, failure domain

## Local run

```bash
python run.py
```
Default port: 5016.
