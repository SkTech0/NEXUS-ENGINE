# Rejection Explanation

## Definition

**Rejection explanation** is the structured explanation of why a request or entity was rejected: decision path, contribution breakdown, cause (e.g. rule, constraint, trust gate), and narrative. It is derived from ECOL decision trace, reasoning trace, and influence—without altering decision logic.

## Schema

```yaml
explanation_id: string
trace_id: string
target_type: "rejection"
target_ref: string  # decision_id or output_ref for reject outcome
generated_at: ISO8601
locale: string
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Rejection context
outcome_type: "deny"  # or equivalent reject
rejection_reason: string | null  # e.g. "policy", "trust_gate", "constraint"
rejection_code: string | null  # optional code for programmatic use
decision_id: string
branch_taken: string | null  # e.g. "reject"
input_refs: string[]

# Cause (primary cause of rejection)
cause_chain_ref: string | null
immediate_cause_ref: string | null  # rule_id, constraint_id, trust_ref
immediate_cause_readable: string  # e.g. "Eligibility rule E-001 not satisfied"
root_cause_readable: string | null

# Reasoning (from EEL reasoning model)
reasoning_path_ref: string
reasoning_summary: string
reasoning_steps: list of { step_id, conclusion, conclusion_readable, evidence_ref }  # steps leading to reject

# Contribution (from EEL contribution model)
contribution_breakdown: list of { contributor_type, contributor_ref, contributor_name, contribution, rank }
contribution_summary: string

# Trust / risk (when applicable)
trust_impact: string | null  # e.g. "Trust below threshold"
risk_impact: string | null  # e.g. "Risk tier high; policy requires reject"

# Narrative
narrative: string  # primary human-readable explanation of the rejection
narrative_short: string | null  # one-line for customer
narrative_audit: string | null
narrative_regulator: string | null
narrative_customer: string | null  # customer-safe, no internal refs
```

## Deterministic Rules

1. **Rejection reason**: rejection_reason = f(immediate_cause_ref, branch_taken); e.g. rule → "policy", trust_ref → "trust_gate", constraint → "constraint".
2. **Immediate cause readable**: immediate_cause_readable = f(immediate_cause_ref, evidence_ref, locale); deterministic (cognition-to-language).
3. **Narrative**: narrative = f(rejection_reason, immediate_cause_readable, reasoning_summary, trust_impact, risk_impact, locale, audience); template-based, deterministic.
4. **Customer narrative**: narrative_customer omits internal refs (rule_id, constraint_id); uses only customer-safe labels (contracts/enterprise-contract.md).

## Transformation (ECOL → EEL)

- **Input**: ECOL decision trace (decision_id, outcome = deny/reject), reasoning trace (steps leading to reject), cause chain (immediate cause = rule/constraint/trust), influence records.
- **Output**: rejection explanation with cause, reasoning, contribution, trust/risk impact, and narratives.
- **Pipeline**: trace-to-explanation (rejection) → cause model → reasoning model → contribution model → narrative generation.

## Contract

- Rejection explanation is produced by EEL pipeline; engine and ECOL unchanged.
- narrative_customer must not expose internal implementation details (governance/explainability-policy.md).
