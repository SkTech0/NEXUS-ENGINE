# Decision Explanation

## Definition

**Decision explanation** is the structured explanation of why a specific decision was made: reasoning path, contribution breakdown, cause chain, confidence, and narrative. It is derived from ECOL decision trace, reasoning trace, decision graph, and influence—without altering decision logic.

## Schema

```yaml
explanation_id: string
trace_id: string
target_type: "decision"
target_ref: string  # decision_id
generated_at: ISO8601
locale: string
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Decision context
decision_type: enum [binary | multi_way | continuous | delegation | fallback]
outcome_ref: string
outcome_type: enum [approve | deny | refer | defer | custom]
branch_taken: string | null
input_refs: string[]

# Reasoning (from EEL reasoning model)
reasoning_path_ref: string
reasoning_summary: string
reasoning_steps: list of { step_id, conclusion, conclusion_readable, evidence_ref }

# Cause (from EEL cause model)
cause_chain_ref: string | null
cause_summary: string | null

# Contribution (from EEL contribution model)
contribution_breakdown: list of { contributor_type, contributor_ref, contributor_name, contribution, rank }
contribution_summary: string

# Confidence / uncertainty
confidence: float | null
confidence_explanation: string | null
uncertainty: float | null
uncertainty_explanation: string | null

# Narrative
narrative: string  # primary human-readable explanation of the decision
narrative_short: string | null
narrative_audit: string | null
narrative_regulator: string | null
```

## Deterministic Rules

1. **Reasoning**: reasoning_path_ref and reasoning_steps are populated from ECOL reasoning trace for this decision (input_refs → decision); ordering preserved.
2. **Contribution**: contribution_breakdown is from ECOL influence records where influenced_ref = decision_id; normalized; rank by contribution descending.
3. **Narrative**: narrative = f(decision_type, outcome_type, branch_taken, reasoning_summary, contribution_summary, confidence, locale, audience); template-based, deterministic (mappings/graph-to-narrative, cognition-to-language).

## Transformation (ECOL → EEL)

- **Input**: ECOL decision trace (decision_id, outcome_ref, branch_taken, input_refs), reasoning trace (steps feeding this decision), decision graph, influence records.
- **Output**: decision explanation with reasoning, contribution, cause (optional), confidence, and narratives.
- **Pipeline**: trace-to-explanation (decision) → reasoning model → contribution model → cause model (optional) → narrative generation.

## Contract

- Decision explanation is produced by EEL pipeline; engine and ECOL unchanged.
- explanation_id and target_ref are immutable; audience determines which narrative variants are included (contracts/explanation-contract.md, audit-contract.md, regulator-contract.md).
