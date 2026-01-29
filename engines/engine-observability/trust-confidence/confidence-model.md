# Confidence Model

## Definition

**Confidence** in ECOL is a score representing the engine’s belief strength in an outcome, conclusion, or prediction. This model defines confidence structure for observability—without altering confidence computation logic.

## Confidence Schema

```yaml
confidence_id: string
trace_id: string
timestamp: ISO8601

ref_type: enum [reasoning_step | decision | output | model]
ref_id: string  # step_id, decision_id, output_ref, model_id

confidence: float  # [0,1]
uncertainty: float | null  # [0,1] or complementary
source: enum [rule | model | aggregation | human | default]
aggregation_method: string | null  # when source = aggregation

# Optional
metadata: map
```

## Source Types (Semantics)

| Source | Description |
|--------|-------------|
| **rule** | Confidence from rule or policy |
| **model** | Confidence from model (e.g. probability) |
| **aggregation** | Combined from multiple inputs (min, product, weighted) |
| **human** | Human-provided or override |
| **default** | Default when no other source |

## Propagation Rules

1. **Ref binding**: Every confidence is attached to a ref (step, decision, output, or model).
2. **Trace binding**: confidence is always request-scoped (trace_id set).
3. **Uncertainty**: When uncertainty is present, it may be 1 - confidence or independently computed (see uncertainty-model.md).
4. **Flow**: Confidence flow over time is in flows/confidence-flow.md.

## Relationship to Other Models

- **Confidence flow**: flows/confidence-flow.md defines how confidence propagates.
- **Uncertainty**: trust-confidence/uncertainty-model.md defines uncertainty semantics.
- **Trust**: trust-model.md is distinct; trust is reliability of source, confidence is belief in outcome.

## Contract

- Confidence is recorded when produced or updated (at instrumentation boundary); no change to confidence computation logic.
- confidence in [0,1]; interpretation is policy-defined.
