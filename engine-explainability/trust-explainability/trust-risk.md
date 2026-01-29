# Trust-Risk Explainability

## Definition

**Trust-risk explainability** is the representation of the relationship between trust and risk when both affect a decision: trust score, risk score/tier, effect (e.g. low trust or high risk → refer), and narrative. It is derived from ECOL trust flow, risk flow, and decision flow—without altering engine logic.

## Schema

```yaml
trust_risk_explanation_id: string
trace_id: string
target_ref: string  # decision_id
generated_at: ISO8601
locale: string

# Trust
trust_ref: string
trust_score: float  # [0,1]
trust_readable: string  # e.g. "Trust 0.6"

# Risk
risk_ref: string  # risk event or entity
risk_score: float | null  # [0,1]
risk_tier: string | null  # e.g. low, medium, high
risk_type: string | null  # e.g. fraud, credit
risk_readable: string  # e.g. "Risk tier: Medium (fraud)"

# Effect on decision
effect: enum [escalate | refer | deny | allow | mitigate]
effect_readable: string  # e.g. "Trust and risk led to manual review"
evidence_ref: string | null
trust_contributed: boolean  # true if trust was a factor
risk_contributed: boolean  # true if risk was a factor

# Summary
summary: string  # human-readable summary of trust and risk impact
```

## Deterministic Rules

1. **Trust readable**: trust_readable = f(trust_score, locale); deterministic.
2. **Risk readable**: risk_readable = f(risk_score, risk_tier, risk_type, locale); deterministic template.
3. **Effect readable**: effect_readable = f(effect, trust_contributed, risk_contributed, locale); deterministic (e.g. refer + both → "Trust and risk led to manual review").
4. **Summary**: summary = f(trust_readable, risk_readable, effect_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL trust influence, risk flow (flows/risk-flow.md), decision flow (outcome, branch) for target_ref.
- **Output**: trust_risk_explanation with trust, risk, effect, contribution flags, summary.
- **Rules**: trust_contributed and risk_contributed from presence of trust/risk influence records for target_ref.

## Contract

- Trust-risk explanation is read-only over ECOL; no change to trust, risk, or decision logic.
- trust_risk_explanation_id is immutable; target_ref is required for audit.
