# Engine Optimization

TypeScript (Nx) + Python optimization modules.

## Python layout

| Subfolder   | File                 | Description                    |
|------------|----------------------|--------------------------------|
| **heuristics** | heuristic_engine.py | Apply/chain heuristics         |
| **solvers**    | optimizer.py        | Objective, constraints, solve  |
| **schedulers** | scheduler.py        | Tasks, slots, schedule        |
| **allocators** | resource_allocator.py | Resources, demands, allocate |
| **predictors**| predictor.py        | Predict from inputs            |

Run from repo root with `PYTHONPATH=engine-optimization`:

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=engine-optimization
python -c "from solvers import create_optimizer; o = create_optimizer(lambda x: x); print(o.solve(1.0))"
```
