# Cause Model (Explainability)

## Definition

The **cause model** for explainability is the representation of cause-effect and dependency chains in a form suitable for human interpretation: cause chain, effect, strength, and optional narrative. It is derived from ECOL causality and dependency-influence—without altering engine behavior.

## Cause Explanation Structure

```yaml
cause_explanation_id: string
trace_id: string
target_ref: string  # effect (decision_id, output_ref, failure_id)
target_type: enum [decision | output | failure | recovery]
generated_at: ISO8601
locale: string

# Cause chain (ordered from root cause to immediate cause)
cause_chain: list of:
  cause_id: string
  cause_ref: string  # input_id, step_id, decision_id, failure_id
  cause_type: enum [input | reasoning_step | decision | state_change | failure | external]
  effect_ref: string  # next in chain or target_ref
  strength: enum [direct | indirect | inferred]
  evidence_ref: string | null
  cause_readable: string | null  # human-readable cause description

# Summary
root_cause_ref: string  # first in cause_chain
immediate_cause_ref: string  # last in cause_chain (direct cause of target)
cause_summary: string  # human-readable summary of cause chain
chain_length: integer
```

## Deterministic Rules

1. **Chain order**: cause_chain is ordered from root (earliest/furthest) to immediate cause (direct cause of target); order from ECOL causality graph (topological or temporal).
2. **Strength**: Only direct and indirect causes are included in audit/regulator narratives; inferred is optional and tagged.
3. **Cause readable**: cause_readable = f(cause_type, cause_ref, evidence_ref, locale); deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL causality edges (cause_ref → effect_ref, strength, evidence), ECOL dependency edges.
- **Output**: cause_chain for target_ref by traversing backward from target_ref; root_cause_ref = leaf of traversal.
- **Rules**: See causality-explainability/cause-effect.md and influence-chain.md.

## Contract

- Cause explanation is read-only over ECOL causality; no change to engine logic.
- cause_explanation_id is immutable; target_ref and trace_id are required for audit.
