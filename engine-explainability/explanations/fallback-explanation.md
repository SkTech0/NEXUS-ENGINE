# Fallback Explanation

## Definition

**Fallback explanation** is the structured explanation of why a fallback path was taken (cache, default, alternate service, human review, reject): trigger, primary path, fallback path, outcome, and narrative. It is derived from ECOL fallback model and recovery trace—without altering fallback logic.

## Schema

```yaml
explanation_id: string
trace_id: string
target_type: "fallback"
target_ref: string  # fallback_id
generated_at: ISO8601
locale: string
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Fallback context
trigger_type: enum [failure | timeout | degradation | policy]
trigger_ref: string  # failure_id, span_id, policy id
trigger_readable: string  # e.g. "Primary service timed out"
primary_path_ref: string
primary_path_readable: string  # e.g. "Live pricing service"
fallback_path_id: string
fallback_path_name: string  # e.g. "cache", "default_approve"
fallback_type: enum [cache | default | alternate_service | human_review | reject]
outcome_ref: string | null  # decision or output from fallback
outcome_status: enum [success | failure | partial]
confidence_impact: enum [none | reduced | unknown] | null

# Cause (why fallback was triggered)
cause_chain_ref: string | null
immediate_cause_readable: string  # e.g. "Timeout after 5s"

# Narrative
narrative: string  # primary human-readable explanation of the fallback
narrative_short: string | null  # e.g. "Used cached result due to timeout"
narrative_audit: string | null
narrative_regulator: string | null
narrative_customer: string | null  # customer-safe; e.g. "Result based on available data"
```

## Deterministic Rules

1. **Trigger readable**: trigger_readable = f(trigger_type, trigger_ref, locale); deterministic (e.g. failure → "Primary service failed", timeout → "Primary service timed out").
2. **Primary/fallback path readable**: primary_path_readable and fallback_path_name from ECOL fallback record or catalog; deterministic.
3. **Narrative**: narrative = f(trigger_readable, primary_path_readable, fallback_path_name, outcome_status, confidence_impact, locale, audience); template-based, deterministic.
4. **Customer narrative**: narrative_customer does not mention "fallback" or "timeout" where policy forbids; use neutral phrasing (e.g. "Result based on available data") (governance/explainability-policy.md).

## Transformation (ECOL → EEL)

- **Input**: ECOL fallback record (failures/fallback-model.md), recovery trace (action_type=fallback), failure trace (trigger_ref).
- **Output**: fallback explanation with trigger, paths, outcome, cause, and narratives.
- **Pipeline**: trace-to-explanation (fallback) → cause model (trigger) → narrative generation.

## Contract

- Fallback explanation is produced by EEL pipeline; engine and ECOL unchanged.
- narrative_customer must comply with policy (governance/explainability-policy.md) for disclosure of fallback/timeout/failure.
