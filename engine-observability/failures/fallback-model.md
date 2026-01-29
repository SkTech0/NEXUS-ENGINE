# Fallback Model

## Definition

**Fallback** is the selection and execution of an alternative path when the primary path fails or is unavailable. This model defines how fallback is represented for cognitive observability: trigger, path taken, and outcome—without altering fallback logic.

## Fallback Schema

```yaml
fallback_id: string
trace_id: string
timestamp: ISO8601

# Trigger
trigger_type: enum [failure | timeout | degradation | policy]
trigger_ref: string  # failure_id, span_id, or policy id
primary_path_ref: string  # the path that was not taken or failed

# Fallback path
fallback_path_id: string
fallback_path_name: string | null  # e.g. "cache", "default_approve"
fallback_type: enum [cache | default | alternate_service | human_review | reject]

# Outcome
outcome_ref: string | null  # decision or output from fallback
outcome_status: enum [success | failure | partial]
confidence_impact: enum [none | reduced | unknown] | null  # if fallback has lower confidence
```

## Fallback Types (Semantics)

| Type | Description |
|------|-------------|
| **cache** | Cached or stale value used |
| **default** | Default value or policy applied |
| **alternate_service** | Alternate implementation or service used |
| **human_review** | Escalated to human |
| **reject** | Request rejected (e.g. unable to process) |

## Propagation Rules

1. **Trigger binding**: Every fallback has a trigger_ref (failure, timeout, degradation, or policy).
2. **Path binding**: fallback_path_id and fallback_path_name identify the alternative path; primary_path_ref identifies what was attempted first.
3. **Outcome**: outcome_ref links to the decision or output produced by the fallback path; outcome_status indicates success/failure/partial.

## Relationship to Other Models

- **Recovery**: recovery/recovery-model.md may include fallback as a recovery action; fallback_id can link to recovery trace.
- **Decision flow**: Fallback outcome is a decision or output; decision_id or output_ref can be outcome_ref.
- **Reasoning**: cognition/reasoning-model.md reasoning_type=fallback; fallback_id can link to that step.

## Contract

- Fallback is recorded when a fallback path is taken (at instrumentation boundary); no change to fallback selection or execution logic.
- confidence_impact supports explainability (“decision was made with reduced confidence due to fallback”).
