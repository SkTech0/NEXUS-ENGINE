# Trust Validation Explainability

## Definition

**Trust validation explainability** is the representation of how trust was validated or computed: source (computed, policy, human, default), inputs, and narrative. It is derived from ECOL trust flow—without altering trust computation logic.

## Schema

```yaml
trust_validation_explanation_id: string
trace_id: string
target_ref: string  # trust_event_id or ref (entity_id, input_ref)
generated_at: ISO8601
locale: string

# Trust
trust_ref: string
trust_score: float  # [0,1]
trust_dimension: string | null
source: enum [computed | policy | human | default]
source_readable: string  # e.g. "Computed from history"
input_trust_refs: string[]  # prior trust events that fed this (when computed)
input_trust_readable: string | null  # e.g. "Aggregated from 3 inputs"

# Validation (optional)
validation_method: string | null  # e.g. "threshold_check", "aggregation"
validation_method_readable: string | null
criteria_met: list of string | null  # e.g. "Above 0.5"

# Summary
summary: string  # human-readable summary of trust validation
```

## Deterministic Rules

1. **Source readable**: source_readable = f(source, locale); deterministic (e.g. computed → "Computed from history", policy → "Policy-defined").
2. **Input trust readable**: input_trust_readable = f(input_trust_refs, locale); deterministic (e.g. "Aggregated from 3 inputs").
3. **Validation method readable**: validation_method_readable = f(validation_method, locale); deterministic when validation_method is set.
4. **Summary**: summary = f(trust_score, trust_dimension, source_readable, input_trust_readable, validation_method_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL trust flow event (flows/trust-flow.md) for target_ref.
- **Output**: trust_validation_explanation with trust, source, input_trust_refs, optional validation, summary.
- **Rules**: See mappings/trace-to-explanation.md; validation_method from ECOL metadata if present.

## Contract

- Trust validation explanation is read-only over ECOL trust flow; no change to trust computation.
- trust_validation_explanation_id is immutable; target_ref is required for audit.
