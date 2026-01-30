# engine-trust-service

Independent service wrapping engine-trust.

## Responsibility

- Wraps engine-trust
- Exposes: `/api/Trust/verify`, `/api/Trust/health`, `/health`
- Independent deployment, scaling, failure domain

## Local run

```bash
python run.py
```
Default port: 5014.
