# Explanation Model

## Definition

The **explanation model** is the canonical structure for all EEL explanations: target, reasoning path, cause chain, contribution breakdown, confidence, risk, and narrative. It is the root model from which decision, outcome, rejection, approval, and other explanation types derive.

## Explanation Structure

```yaml
explanation_id: string
trace_id: string
target_type: enum [decision | outcome | rejection | approval | review | fallback | recovery | failure]
target_ref: string  # decision_id, output_ref, failure_id, etc.
generated_at: ISO8601
locale: string  # e.g. en-US
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Reasoning
reasoning_path_ref: string  # ECOL decision graph or reasoning trace
reasoning_summary: string | null  # human-readable summary of reasoning path
reasoning_steps: list of { step_id, conclusion, evidence_ref }  # ordered

# Cause
cause_chain_ref: string | null  # ECOL causality or EEL cause chain
cause_summary: string | null  # human-readable cause summary

# Contribution
contribution_breakdown: list of { contributor_type, contributor_ref, contribution, evidence_ref }
contribution_summary: string | null  # human-readable contribution summary

# Confidence / uncertainty
confidence: float | null  # [0,1]
confidence_explanation: string | null
uncertainty: float | null
uncertainty_explanation: string | null

# Risk (when applicable)
risk_level: string | null  # e.g. low, medium, high
risk_explanation: string | null

# Trust (when applicable)
trust_impact: string | null  # e.g. "trust gate passed", "low trust triggered review"
trust_explanation: string | null

# Narrative (generated)
narrative: string  # primary human-readable explanation
narrative_short: string | null  # one-line or summary
narrative_audit: string | null  # auditor-grade narrative
narrative_regulator: string | null  # regulator-grade narrative
```

## Deterministic Rules

1. **Target binding**: explanation_id and target_ref uniquely identify the explained entity; trace_id binds to ECOL trace.
2. **Reasoning**: reasoning_path_ref and reasoning_steps are populated from ECOL reasoning trace or decision graph; ordering is preserved.
3. **Contribution**: contribution_breakdown is populated from ECOL influence records; sum of contribution ≤ 1 (normalized).
4. **Narrative**: narrative is generated from templates and mappings (mappings/cognition-to-language, graph-to-narrative); same structural input + same template + same locale → same narrative (deterministic).

## Transformation (ECOL → EEL)

- **Input**: ECOL reasoning trace, decision trace, decision graph, influence records, causality records.
- **Output**: Explanation structure above.
- **Rules**: See mappings/ecol-to-eel-mapping.md and mappings/trace-to-explanation.md.

## Contract

- Explanations are produced by the EEL pipeline; engine and ECOL are unchanged.
- explanation_id is immutable; regeneration creates a new id.
- audience determines which narrative variant and detail level are included (contracts/*).
