# Engine Optimization & Distributed — Implementation Summary

Enterprise-grade implementation of real logic for `engine-optimization-service` and `engine-distributed-service` (branch: `feature/engine-optimization-distributed-real-logic`).

---

## 1. Engine Optimization Service

### Domain Facade (`app/domain_facade.py`)

- **Path resolution:** Works in repo layout and Docker (`/app/engine-optimization`)
- **Targets:**
  - **loan_approval:** Policy-based feasibility (creditScore ≥ 600, incomeToLoan ≤ 0.4, existingLoans ≤ 5) + eligibility score 0–1
  - **scheduling:** Task scheduling via Scheduler (priority, deadline)
  - **allocation:** Resource allocation via ResourceAllocator
  - **generic:** Optimizer + constraints, safe bounds

### Service Layer

- Validation at entry, structured logging
- Domain error mapping (BaseEngineError → API response)
- Fallback when engine domain unavailable

### Deployment

- `deploy/railway/engine-optimization/Dockerfile` copies `engine-optimization/` and sets `PYTHONPATH`

### API Contract

| Endpoint | Request | Response |
|----------|---------|----------|
| POST /api/Optimization/optimize | targetId, objective, constraints | targetId, value, feasible |

---

## 2. Engine Distributed Service

### Domain Facade (`app/domain_facade.py`)

- **Replication:** Append entries to ReplicationEngine; sync from leader
- **Coordination:**
  - `elect`: Bully leader election
  - `lock` / `acquire`: Distributed lock
  - `unlock` / `release`: Release lock
  - `status`: Current leader, term, log length

### Service Layer

- Payload validation, structured logging
- Domain error mapping

### Deployment

- `deploy/railway/engine-distributed/Dockerfile` copies `engine-distributed/` and sets `PYTHONPATH`

### API Contract

| Endpoint | Action | Payload | Response |
|----------|--------|---------|----------|
| POST /api/Distributed/replicate | — | entries, nodeId, syncFrom? | status, replicated, lastIndex, term |
| POST /api/Distributed/coordinate | elect | nodeIds | status, coordinated, leaderId, term |
| POST /api/Distributed/coordinate | lock | lockId, holder, ttlSeconds? | status, coordinated, acquired |
| POST /api/Distributed/coordinate | unlock | lockId, holder | status, coordinated, released |

---

## 3. Constraint Validation (engine-optimization)

`engine-optimization/validation/constraint_validation.py`:

- `validate_constraints()` checks creditScore, incomeToLoan, existingLoans bounds
- `safe_optimization_bounds()`, `scheduler_safety_check()` for ERL-4

---

## 4. Integration Tests

- `services/engine-optimization-service/tests/test_domain_facade.py`
- `services/engine-distributed-service/tests/test_domain_facade.py`

Run with:
```bash
cd services/engine-optimization-service
PYTHONPATH=../../engine-optimization:. pytest tests/ -v
```

---

## 5. Loan Decision Flow

`LoanDecisionService` passes `optConstraints` to Optimization. With real logic:

- `creditScore`, `incomeToLoan`, `existingLoans` → feasibility
- `optRes.Feasible` feeds into eligibility and confidence

---

## 6. Environment Variables

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| LOAN_CREDIT_MIN | optimization | 600 | Min credit score |
| LOAN_INCOME_TO_LOAN_MAX | optimization | 0.4 | Max income-to-loan ratio |
| LOAN_EXISTING_LOANS_MAX | optimization | 5 | Max existing loans |
| ENGINE_OPTIMIZATION_PATH | optimization | — | Override engine-optimization path |
| ENGINE_DISTRIBUTED_PATH | distributed | — | Override engine-distributed path |
| ENGINE_DISTRIBUTED_NODE_ID | distributed | node-1 | Node identifier |
