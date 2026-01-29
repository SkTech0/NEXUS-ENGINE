# Recovery Explanation

## Definition

**Recovery explanation** is the structured explanation of how recovery was performed after a failure or degradation: trigger, actions (retry, fallback, compensation, self-heal, escalate), final outcome, and narrative. It is derived from ECOL recovery trace and recovery model—without altering recovery logic.

## Schema

```yaml
explanation_id: string
trace_id: string
target_type: "recovery"
target_ref: string  # recovery_id
generated_at: ISO8601
locale: string
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Recovery context
trigger_type: enum [failure | degradation | timeout | policy]
trigger_ref: string  # failure_id, event id
trigger_readable: string  # e.g. "Pricing service failure"
original_trace_id: string | null

# Actions (ordered)
actions: list of:
  action_id: string
  sequence: integer
  action_type: enum [retry | fallback | compensation | self_heal | escalate]
  target_ref: string
  target_readable: string  # e.g. "Pricing service"
  outcome: enum [success | failure | partial]
  duration_ms: number | null
  action_readable: string  # e.g. "Retry succeeded after 2s"

# Final outcome
final_outcome: enum [recovered | degraded | failed]
final_outcome_readable: string  # e.g. "System recovered"
stabilization_ref: string | null

# Narrative
narrative: string  # primary human-readable explanation of the recovery
narrative_short: string | null  # e.g. "Recovered after retry"
narrative_audit: string | null
narrative_regulator: string | null
```

## Deterministic Rules

1. **Trigger readable**: trigger_readable = f(trigger_type, trigger_ref, locale); deterministic.
2. **Action readable**: action_readable = f(action_type, target_readable, outcome, duration_ms, locale); template-based, deterministic.
3. **Final outcome readable**: final_outcome_readable = f(final_outcome, locale); deterministic (e.g. recovered → "System recovered", degraded → "System operating in degraded mode", failed → "Recovery failed").
4. **Narrative**: narrative = f(trigger_readable, actions (with action_readable), final_outcome_readable, locale, audience); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL recovery trace (traces/recovery-trace.md), recovery model (recovery/recovery-model.md), failure trace (trigger_ref).
- **Output**: recovery explanation with trigger, actions (with readable), final outcome, and narratives.
- **Pipeline**: trace-to-explanation (recovery) → action readability mapping → narrative generation.

## Contract

- Recovery explanation is produced by EEL pipeline; engine and ECOL unchanged.
- explanation_id and target_ref are immutable; audience determines narrative detail (contracts/audit-contract.md, regulator-contract.md).
