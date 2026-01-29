# Uncertainty Model

## Definition

**Uncertainty** in ECOL is a measure of lack of knowledge or variability in an outcome, conclusion, or prediction. This model defines uncertainty structure for observability—without altering uncertainty computation logic.

## Uncertainty Schema

```yaml
uncertainty_id: string
trace_id: string
timestamp: ISO8601

ref_type: enum [reasoning_step | decision | output | model]
ref_id: string

uncertainty_type: enum [aleatoric | epistemic | total]
value: float  # [0,1] or domain-specific
unit: string | null  # e.g. "probability", "variance"

# Optional
source: enum [model | rule | aggregation | default]
metadata: map
```

## Uncertainty Types (Semantics)

| Type | Description |
|------|-------------|
| **aleatoric** | Irreducible (e.g. data noise, stochasticity) |
| **epistemic** | Reducible (e.g. model uncertainty, missing data) |
| **total** | Combined or unspecified |

## Propagation Rules

1. **Ref binding**: Every uncertainty is attached to a ref (step, decision, output, or model).
2. **Relationship to confidence**: When confidence is present, uncertainty may be 1 - confidence or independent; document relationship in metadata.
3. **Trace binding**: uncertainty is request-scoped (trace_id set).

## Relationship to Other Models

- **Confidence**: confidence-model.md; confidence and uncertainty can be complementary (confidence = 1 - uncertainty) or independent.
- **Reasoning**: cognition/reasoning-model.md step may have uncertainty_reason; uncertainty_id can link to this model.
- **Explainability**: trust-confidence/explainability.md may surface uncertainty for “why uncertain?” explanation.

## Contract

- Uncertainty is recorded when produced (at instrumentation boundary); no change to uncertainty computation logic.
- value interpretation (e.g. 0 = certain, 1 = maximally uncertain) is policy-defined.
