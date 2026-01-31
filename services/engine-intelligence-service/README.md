# engine-intelligence-service

Independent service wrapping engine-intelligence.

## Responsibility

- Wraps engine-intelligence domain (request evaluator)
- Exposes: `/api/Intelligence/evaluate`, `/api/Engine/execute`, `/health`
- Evaluation uses `evaluate_request()` — product-neutral, evidence-based confidence

## Evaluation

`/api/Intelligence/evaluate` accepts `{ context, inputs }` and returns `{ outcome, confidence, payload }` plus optional `reasoning`, `signals`. Confidence is computed from evidence strength (structure, numerics, nesting); outcome is `insufficient`, `evaluated`, or `strong`.

## Local run

```bash
python run.py
```
Default port: 5012.
