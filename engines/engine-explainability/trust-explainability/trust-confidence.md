# Trust-Confidence Explainability

## Definition

**Trust-confidence explainability** is the representation of the relationship between trust (reliability of source) and confidence (belief in outcome) when both apply: trust score, confidence score, and narrative. It is derived from ECOL trust flow and confidence flow—without altering engine logic.

## Schema

```yaml
trust_confidence_explanation_id: string
trace_id: string
target_ref: string  # decision_id or output_ref
generated_at: ISO8601
locale: string

# Trust
trust_ref: string
trust_score: float  # [0,1]
trust_dimension: string | null
trust_readable: string  # e.g. "Source trust 0.8"

# Confidence
confidence_ref: string  # step_id, decision_id, output_ref
confidence: float  # [0,1]
confidence_source: enum [rule | model | aggregation | human | default]
confidence_readable: string  # e.g. "Outcome confidence 0.85"

# Relationship
relationship: enum [independent | trust_gates_confidence | confidence_aggregates_trust]
relationship_readable: string  # e.g. "Trust gate applied before confidence"
interpretation: string | null  # e.g. "High trust and high confidence; auto-approve"

# Summary
summary: string  # human-readable summary of trust and confidence
```

## Deterministic Rules

1. **Trust readable**: trust_readable = f(trust_score, trust_dimension, locale); deterministic.
2. **Confidence readable**: confidence_readable = f(confidence, confidence_source, locale); deterministic.
3. **Relationship**: relationship is inferred from ECOL (e.g. trust influence with effect=gate before decision → trust_gates_confidence); relationship_readable = f(relationship, locale); deterministic.
4. **Summary**: summary = f(trust_readable, confidence_readable, relationship_readable, interpretation, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL trust flow and trust influence, confidence flow for target_ref.
- **Output**: trust_confidence_explanation with trust, confidence, relationship, summary.
- **Rules**: relationship from causality/order of trust and confidence in trace; interpretation from governance thresholds.

## Contract

- Trust-confidence explanation is read-only over ECOL; no change to trust or confidence logic.
- trust_confidence_explanation_id is immutable; target_ref is required for audit.
