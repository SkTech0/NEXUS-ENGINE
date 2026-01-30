# engine-optimization-service

Independent service wrapping engine-optimization.

## Responsibility

- Wraps engine-optimization
- Exposes: `/api/Optimization/optimize`, `/health`
- Independent deployment, scaling, failure domain

## Local run

```bash
python run.py
```
Default port: 5013.
