# Failure Explanation

## Definition

**Failure explanation** is the structured explanation of why a failure occurred and how it propagated (cascade): failure type, cause chain, cascade path, and narrative. It is derived from ECOL failure trace, cascade model, and causality—without altering error handling logic.

## Schema

```yaml
explanation_id: string
trace_id: string
target_type: "failure"
target_ref: string  # failure_id or primary_failure_id
generated_at: ISO8601
locale: string
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Failure context
failure_type: enum [error | timeout | violation | resource | policy]
severity: enum [low | medium | high | critical]
ref: string  # span_id, step_id, component_id
message: string | null
code: string | null
component: string | null
domain: string | null
timestamp: ISO8601

# Cause chain (root cause to immediate cause)
cause_chain_ref: string | null
cause_chain: list of { cause_ref, cause_type, strength, cause_readable }
root_cause_ref: string
root_cause_readable: string
immediate_cause_readable: string

# Cascade (if propagated)
cascade: list of { failure_id, ref, failure_type, hop, message_readable }
cascade_depth: integer  # max hop
cascade_summary: string | null  # human-readable summary of cascade

# Recovery (if applicable)
recovery_trace_ref: string | null
recovery_summary: string | null  # e.g. "Recovered after retry"

# Narrative
narrative: string  # primary human-readable explanation of the failure
narrative_short: string | null  # e.g. "Pricing service timeout"
narrative_audit: string | null
narrative_regulator: string | null
narrative_engineer: string | null  # technical; includes refs, codes
```

## Deterministic Rules

1. **Cause chain**: cause_chain is ordered from root (first) to immediate (last); from ECOL causality backward traversal from target_ref.
2. **Root/immediate readable**: root_cause_readable and immediate_cause_readable = f(cause_ref, cause_type, evidence_ref, locale); deterministic.
3. **Cascade**: cascade list from ECOL failure trace (cascade list); message_readable = f(message, failure_type, locale); deterministic.
4. **Narrative**: narrative = f(failure_type, severity, root_cause_readable, immediate_cause_readable, cascade_summary, recovery_summary, locale, audience); template-based, deterministic.
5. **Customer narrative**: Omit or restrict narrative_customer per policy (e.g. generic "A temporary issue occurred") (governance/explainability-policy.md).

## Transformation (ECOL → EEL)

- **Input**: ECOL failure trace (traces/failure-trace.md), cascade model (failures/cascade-model.md), causality (causality/causality-model.md), recovery trace (if recovery_trace_ref set).
- **Output**: failure explanation with cause chain, cascade, recovery link, and narratives.
- **Pipeline**: trace-to-explanation (failure) → cause model → cascade readability → narrative generation.

## Contract

- Failure explanation is produced by EEL pipeline; engine and ECOL unchanged.
- narrative_engineer may include technical refs and codes; narrative_customer must comply with policy (governance/explainability-policy.md).
