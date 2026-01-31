# Request Evaluator

Product-neutral evaluation of `(context, inputs)` → `(outcome, confidence)`.

## Design

- **Input validation**: `context` (string), `inputs` (dict). Non-dict inputs treated as `{}`.
- **Evidence extraction**: Structural only — key count, numeric count, nested dict count. No domain rules.
- **Confidence**: Deterministic formula from evidence strength. Base 0.5; scales to 1.0.
- **Outcome**: Via `DecisionEngine` with options `insufficient`, `evaluated`, `strong`. Chosen by evidence support.
- **Stateless**: No side effects, no persistence, fast.

## Domain Usage

- `decision.DecisionEngine` — outcome classification
- `errors.ValidationError` — validation (via decision engine)

## API Response

```json
{
  "outcome": "evaluated",
  "confidence": 0.74,
  "payload": { ... },
  "reasoning": "evidence_keys=3 numerics=2 nested=1",
  "signals": { "num_keys": 3, "numeric_count": 2, "nested_count": 1, "outcome_option": "evaluated", "confidence_raw": 0.74 }
}
```

`reasoning` and `signals` are optional diagnostics. Core contract: `outcome`, `confidence`, `payload`.

## Extensibility

- Add new outcome options via `Option()` and scorer logic.
- Adjust `evidence_to_confidence()` weights for different evidence types.
- Context may influence weighting in future (no domain rules).
