# Cause-Effect Explainability

## Definition

**Cause-effect explainability** is the representation of a single cause-effect pair in a form suitable for human interpretation: cause ref, effect ref, strength, evidence, and narrative. It is derived from ECOL causality model—without altering engine behavior.

## Schema

```yaml
cause_effect_explanation_id: string
trace_id: string
causality_id: string  # from ECOL
generated_at: ISO8601
locale: string

# Cause
cause_ref: string
cause_type: enum [input | reasoning_step | decision | state_change | failure | external]
cause_type_readable: string  # e.g. "Reasoning step"
cause_readable: string  # e.g. "Eligibility rule E-001 evaluated"
cause_timestamp: ISO8601
cause_domain: string | null

# Effect
effect_ref: string
effect_type: enum [reasoning_step | decision | output | state_change | failure | recovery]
effect_type_readable: string  # e.g. "Decision"
effect_readable: string  # e.g. "Decision: Approve"
effect_timestamp: ISO8601
effect_domain: string | null

# Relationship
strength: enum [direct | indirect | inferred]
strength_readable: string  # e.g. "Direct cause"
evidence_ref: string | null
evidence_readable: string | null  # e.g. "Rule E-001 output fed decision"

# Summary
summary: string  # human-readable summary of cause-effect
```

## Deterministic Rules

1. **Cause type readable**: cause_type_readable = f(cause_type, locale); deterministic.
2. **Effect type readable**: effect_type_readable = f(effect_type, locale); deterministic.
3. **Cause readable**: cause_readable = f(cause_type, cause_ref, evidence_ref, locale); from cognition-to-language mapping; deterministic.
4. **Effect readable**: effect_readable = f(effect_type, effect_ref, locale); from cognition-to-language mapping; deterministic.
5. **Strength readable**: strength_readable = f(strength, locale); deterministic (e.g. direct → "Direct cause").
6. **Summary**: summary = f(cause_readable, effect_readable, strength_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL causality edge (causality/causality-model.md).
- **Output**: cause_effect_explanation with cause, effect, strength, readable fields, summary.
- **Rules**: See mappings/cognition-to-language.md; cause_readable and effect_readable from ref + type + optional evidence.

## Contract

- Cause-effect explanation is read-only over ECOL causality; no change to engine logic.
- cause_effect_explanation_id is immutable; causality_id and trace_id are required for audit.
- For audit/regulator narratives, only direct and indirect strength are included by default; inferred is optional and tagged (contracts/audit-contract.md).
