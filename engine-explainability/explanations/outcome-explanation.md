# Outcome Explanation

## Definition

**Outcome explanation** is the structured explanation of why a specific outcome (output, result) was produced: reasoning path, contribution breakdown, and narrative. It is derived from ECOL decision graph, reasoning trace, and influence—without altering engine logic.

## Schema

```yaml
explanation_id: string
trace_id: string
target_type: "outcome"
target_ref: string  # output_ref, artifact_ref
generated_at: ISO8601
locale: string
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Outcome context
outcome_type: enum [approve | deny | refer | defer | custom | numeric | structured]
outcome_value: string | null  # e.g. "approved", "0.85"
producer_ref: string | null  # decision_id or step_id that produced this outcome
input_refs: string[]

# Reasoning (from EEL reasoning model)
reasoning_path_ref: string
reasoning_summary: string
reasoning_steps: list of { step_id, conclusion, conclusion_readable, evidence_ref }

# Contribution (from EEL contribution model)
contribution_breakdown: list of { contributor_type, contributor_ref, contributor_name, contribution, rank }
contribution_summary: string

# Confidence / uncertainty
confidence: float | null
confidence_explanation: string | null
uncertainty: float | null
uncertainty_explanation: string | null

# Narrative
narrative: string  # primary human-readable explanation of the outcome
narrative_short: string | null
narrative_audit: string | null
narrative_regulator: string | null
```

## Deterministic Rules

1. **Producer**: producer_ref is the decision_id or step_id whose output_ref = target_ref (from ECOL decision graph or reasoning trace).
2. **Reasoning**: reasoning_steps are the steps that led to producer_ref (backward from producer_ref in decision graph).
3. **Contribution**: contribution_breakdown is from ECOL influence records where influenced_ref = target_ref or producer_ref; normalized.
4. **Narrative**: narrative = f(outcome_type, outcome_value, reasoning_summary, contribution_summary, confidence, locale, audience); deterministic template.

## Transformation (ECOL → EEL)

- **Input**: ECOL decision graph (node for target_ref), reasoning trace (steps feeding producer), influence records for target_ref/producer_ref.
- **Output**: outcome explanation with reasoning, contribution, confidence, and narratives.
- **Pipeline**: trace-to-explanation (outcome) → reasoning model → contribution model → narrative generation.

## Contract

- Outcome explanation is produced by EEL pipeline; engine and ECOL unchanged.
- explanation_id and target_ref are immutable; audience determines narrative variants (contracts/*).
