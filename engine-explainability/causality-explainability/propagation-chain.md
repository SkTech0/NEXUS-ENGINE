# Propagation Chain Explainability

## Definition

**Propagation chain explainability** is the representation of a chain of propagation (influence, failure, recovery, confidence, trust) from source to sink in a form suitable for human interpretation: ordered list of propagation events, with readable descriptions and narrative. It is derived from ECOL propagation model—without altering engine behavior.

## Schema

```yaml
propagation_chain_explanation_id: string
trace_id: string
target_ref: string  # final sink ref or propagation_id
propagation_type: enum [influence | failure | recovery | confidence | trust]
generated_at: ISO8601
locale: string

# Chain (ordered from source to sink)
chain: list of:
  sequence: integer
  propagation_id: string  # from ECOL
  source_ref: string
  source_type_readable: string  # e.g. "Component"
  sink_ref: string
  sink_type_readable: string  # e.g. "Decision"
  hop: integer
  magnitude: float | null
  magnitude_readable: string | null  # e.g. "High"
  step_readable: string  # e.g. "Failure propagated from pricing service to decision"

# Summary
chain_length: integer
source_ref: string  # first source in chain
sink_ref: string    # last sink in chain (may equal target_ref)
propagation_type_readable: string  # e.g. "Failure propagation"
summary: string  # human-readable summary of propagation chain
```

## Deterministic Rules

1. **Chain order**: chain is ordered from source (first) to sink (last); order from ECOL propagation events (by timestamp or path).
2. **Source/sink type readable**: source_type_readable and sink_type_readable = f(source_type, sink_type, locale); deterministic.
3. **Magnitude readable**: magnitude_readable = f(magnitude, propagation_type, locale); optional; deterministic when magnitude is set (e.g. thresholds for "Low", "High").
4. **Step readable**: step_readable = f(propagation_type, source_ref, sink_ref, hop, locale); template-based, deterministic (cognition-to-language).
5. **Propagation type readable**: propagation_type_readable = f(propagation_type, locale); deterministic (e.g. failure → "Failure propagation").
6. **Summary**: summary = f(propagation_type_readable, chain_length, source_ref, sink_ref, chain (with step_readable), locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL propagation events (causality/propagation.md) for trace_id and optionally target_ref; build chain by following source_ref → sink_ref.
- **Output**: propagation_chain_explanation with chain (enriched with readable), summary.
- **Rules**: See mappings/graph-to-narrative.md; chain built from propagation path or chronological order.

## Contract

- Propagation chain explanation is read-only over ECOL propagation; no change to engine logic.
- propagation_chain_explanation_id is immutable; target_ref (or propagation_id) and trace_id are required for audit.
- Use for failure cascade explanation (explanations/failure-explanation.md) when propagation_type=failure.
