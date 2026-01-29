# Review Explanation

## Definition

**Review explanation** is the structured explanation of why a request or entity was referred for review (human or manual review): decision path, contribution breakdown, reason for review (e.g. policy, risk, confidence), and narrative. It is derived from ECOL decision trace, reasoning trace, and influence—without altering decision logic.

## Schema

```yaml
explanation_id: string
trace_id: string
target_type: "review"
target_ref: string  # decision_id or output_ref for refer outcome
generated_at: ISO8601
locale: string
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Review context
outcome_type: "refer"  # or equivalent
decision_id: string
branch_taken: string | null  # e.g. "refer", "manual_review"
input_refs: string[]
review_reason: string  # e.g. "policy", "risk", "confidence", "edge_case"
review_reason_readable: string  # e.g. "Risk tier medium; policy requires manual review"
review_code: string | null  # optional code for routing

# Cause (why review was triggered)
cause_chain_ref: string | null
immediate_cause_ref: string | null  # rule_id, risk_ref, confidence_ref
immediate_cause_readable: string

# Reasoning (from EEL reasoning model)
reasoning_path_ref: string
reasoning_summary: string
reasoning_steps: list of { step_id, conclusion, conclusion_readable, evidence_ref }

# Contribution (from EEL contribution model)
contribution_breakdown: list of { contributor_type, contributor_ref, contributor_name, contribution, rank }
contribution_summary: string

# Risk / confidence / trust (when applicable)
risk_impact: string | null
confidence_impact: string | null  # e.g. "Confidence below review threshold"
trust_impact: string | null

# Narrative
narrative: string  # primary human-readable explanation of the review referral
narrative_short: string | null
narrative_audit: string | null
narrative_regulator: string | null
narrative_customer: string | null  # customer-safe; e.g. "Your application is under review"
```

## Deterministic Rules

1. **Review reason**: review_reason = f(immediate_cause_ref, branch_taken); e.g. risk_ref → "risk", confidence_ref → "confidence", rule → "policy".
2. **Review reason readable**: review_reason_readable = f(review_reason, immediate_cause_readable, locale); deterministic template.
3. **Narrative**: narrative = f(review_reason_readable, reasoning_summary, risk_impact, confidence_impact, locale, audience); template-based, deterministic.
4. **Customer narrative**: narrative_customer is generic where appropriate (e.g. "under review"); no internal policy details (governance/explainability-policy.md).

## Transformation (ECOL → EEL)

- **Input**: ECOL decision trace (decision_id, outcome = refer), reasoning trace (steps leading to refer), cause chain, influence records, risk/confidence/trust flow.
- **Output**: review explanation with review reason, cause, reasoning, contribution, risk/confidence/trust impact, and narratives.
- **Pipeline**: trace-to-explanation (review) → cause model → reasoning model → contribution model → narrative generation.

## Contract

- Review explanation is produced by EEL pipeline; engine and ECOL unchanged.
- narrative_customer must not expose internal review criteria beyond what is permitted (governance/explainability-policy.md).
