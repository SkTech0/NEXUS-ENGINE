# engine-optimization-service

Enterprise optimization service wrapping engine-optimization domain (solvers, heuristics, schedulers, allocators).

## Responsibility

- Wraps engine-optimization: Optimizer, HeuristicEngine, Scheduler, ResourceAllocator
- Exposes: `POST /api/Optimization/optimize`, `GET /api/Optimization/health`, `GET /health`
- Supports targets: loan_approval, scheduling, allocation, generic
- Independent deployment, scaling, failure domain

## API

### POST /api/Optimization/optimize

**Request:**
```json
{
  "targetId": "loan_approval",
  "objective": "maximize",
  "constraints": {
    "creditScore": 750,
    "incomeToLoan": 0.3,
    "existingLoans": 1
  }
}
```

**Response:**
```json
{
  "targetId": "loan_approval",
  "value": 0.8,
  "feasible": true
}
```

**Targets:**
| targetId | constraints | Description |
|----------|-------------|-------------|
| loan_approval | creditScore, incomeToLoan, existingLoans | Policy-based feasibility + eligibility score |
| scheduling | tasks: [{id, duration, priority?, deadline?}] | Task scheduling by priority |
| allocation | resources: [{id, capacity}], demands: {consumerId: {resId: amount}} | Resource allocation |
| generic | initial?, creditScore?, incomeToLoan? | Optimizer + heuristic improvement |

**Policy (loan_approval):** creditScore ≥ 600, incomeToLoan ≤ 0.4, existingLoans ≤ 5 (env-overridable).

## Local run

From repo root with engine-optimization available:

```bash
cd services/engine-optimization-service
PYTHONPATH=../../engine-optimization:. python run.py
```

Default port: 5013 (or `PORT` env).
