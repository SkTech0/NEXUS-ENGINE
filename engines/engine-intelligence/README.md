# Engine Intelligence

TypeScript (Nx) + Python intelligence modules.

## Python layout

| Subfolder   | File                 | Description                    |
|------------|----------------------|--------------------------------|
| **reasoning** | reasoning_engine.py | Facts, rules, step/run         |
| **inference** | inference_engine.py | Premises, conclusions, handlers |
| **decision**  | decision_engine.py | Options, context, decide/rank  |
| **planning**  | planner.py         | Goals, actions, plans         |
| **learning**  | learning_engine.py | Examples, fit, predict         |
| **evaluation**| evaluator.py       | EvalSample, metrics, accuracy  |

Run from repo root with `PYTHONPATH=engine-intelligence`:

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=engine-intelligence
python -c "from reasoning import create_reasoning_engine; e = create_reasoning_engine(); print(e.get_facts())"
```
