# Reasoning Model (Explainability)

## Definition

The **reasoning model** for explainability is the representation of the engine’s reasoning path in a form suitable for human interpretation: ordered steps, conclusions, evidence refs, and optional natural-language summaries. It is derived from ECOL reasoning trace and decision graph—without altering engine reasoning.

## Reasoning Explanation Structure

```yaml
reasoning_explanation_id: string
trace_id: string
target_ref: string  # decision_id or output_ref this reasoning explains
generated_at: ISO8601
locale: string

# Steps (ordered; from ECOL reasoning trace)
steps: list of:
  step_id: string
  sequence: integer
  reasoning_type: enum [rule_based | constraint_satisfaction | inference | aggregation | delegation | fallback]
  conclusion: string  # structured or short label
  conclusion_readable: string | null  # human-readable conclusion
  input_refs: string[]
  output_ref: string
  evidence_ref: string | null  # rule_id, constraint_id, model_id
  confidence: float | null
  duration_ms: number | null

# Summary
summary: string  # human-readable summary of full reasoning path
step_count: integer
conclusion_refs: string[]  # final output refs
```

## Deterministic Rules

1. **Ordering**: steps are ordered by sequence (from ECOL reasoning trace); no reordering.
2. **Conclusion readable**: conclusion_readable is produced by mapping (cognition-to-language) from conclusion type and evidence_ref; deterministic for same input.
3. **Summary**: summary is produced by graph-to-narrative or template from steps; deterministic for same steps + template + locale.

## Transformation (ECOL → EEL)

- **Input**: ECOL reasoning trace (steps with step_id, sequence, reasoning_type, conclusion, output_ref, confidence).
- **Output**: reasoning_explanation with steps (enriched with conclusion_readable, evidence_ref) and summary.
- **Rules**: Each ECOL step maps to one step in reasoning_explanation; conclusion_readable = f(reasoning_type, conclusion, evidence_ref, locale).

## Contract

- Reasoning explanation is read-only over ECOL data; no change to reasoning logic.
- reasoning_explanation_id is immutable; trace_id and target_ref are required for audit.
