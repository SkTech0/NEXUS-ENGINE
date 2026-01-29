# Trust Failure Explainability

## Definition

**Trust failure explainability** is the representation of when low trust led to a negative outcome (deny, refer, default): trust score, threshold, effect, and narrative. It is derived from ECOL trust influence with effect=denied or default_used—without altering trust or decision logic.

## Schema

```yaml
trust_failure_explanation_id: string
trace_id: string
target_ref: string  # decision_id or trust influence id
generated_at: ISO8601
locale: string

# Trust
trust_ref: string
trust_score: float  # [0,1]
trust_dimension: string | null
trust_readable: string  # e.g. "Trust 0.35 (data quality)"

# Failure (outcome due to low trust)
effect: enum [denied | default_used | reduced_weight]
effect_readable: string  # e.g. "Request denied due to low trust"
threshold_used: float | null  # e.g. 0.5
threshold_readable: string | null  # e.g. "Threshold 0.5"
below_threshold: boolean  # true if trust_score < threshold_used

# Cause
immediate_cause_readable: string  # e.g. "Trust below threshold; policy requires deny"
evidence_ref: string | null

# Summary
summary: string  # human-readable summary of trust failure
```

## Deterministic Rules

1. **Trust readable**: trust_readable = f(trust_score, trust_dimension, locale); deterministic.
2. **Effect readable**: effect_readable = f(effect, trust_score, threshold_used, locale); deterministic (e.g. denied → "Request denied due to low trust").
3. **Below threshold**: below_threshold = (threshold_used != null && trust_score < threshold_used); deterministic.
4. **Immediate cause readable**: immediate_cause_readable = f(effect, threshold_readable, trust_readable, locale); deterministic template.
5. **Summary**: summary = f(trust_readable, effect_readable, immediate_cause_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL trust influence (influence/trust-influence.md) with effect = denied or default_used for target_ref; trust flow (trust_score).
- **Output**: trust_failure_explanation with trust, effect, threshold, below_threshold, cause, summary.
- **Rules**: threshold_used from ECOL or policy; below_threshold computed; narrative for "why denied/referred due to trust".

## Contract

- Trust failure explanation is read-only over ECOL trust; no change to trust or decision logic.
- trust_failure_explanation_id is immutable; target_ref is required for audit.
- Use for rejection/review explanations when trust was the primary cause (explanations/rejection-explanation.md, review-explanation.md).
