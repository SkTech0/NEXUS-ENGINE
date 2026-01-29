# Approval Explanation

## Definition

**Approval explanation** is the structured explanation of why a request or entity was approved: decision path, contribution breakdown, confidence, and narrative. It is derived from ECOL decision trace, reasoning trace, and influence—without altering decision logic.

## Schema

```yaml
explanation_id: string
trace_id: string
target_type: "approval"
target_ref: string  # decision_id or output_ref for approve outcome
generated_at: ISO8601
locale: string
audience: enum [human | auditor | regulator | enterprise | customer | investor | engineer]

# Approval context
outcome_type: "approve"  # or equivalent
decision_id: string
branch_taken: string | null  # e.g. "approve", "tier_1"
input_refs: string[]
approval_conditions_met: list of string | null  # optional human-readable conditions

# Reasoning (from EEL reasoning model)
reasoning_path_ref: string
reasoning_summary: string
reasoning_steps: list of { step_id, conclusion, conclusion_readable, evidence_ref }

# Contribution (from EEL contribution model)
contribution_breakdown: list of { contributor_type, contributor_ref, contributor_name, contribution, rank }
contribution_summary: string

# Confidence / trust
confidence: float | null
confidence_explanation: string | null
trust_impact: string | null  # e.g. "Trust above threshold; auto-approve"

# Narrative
narrative: string  # primary human-readable explanation of the approval
narrative_short: string | null
narrative_audit: string | null
narrative_regulator: string | null
narrative_customer: string | null  # customer-safe
```

## Deterministic Rules

1. **Approval conditions**: approval_conditions_met = list of conclusion_readable for steps that were required (e.g. eligibility rules passed); optional; from reasoning_steps.
2. **Narrative**: narrative = f(outcome_type, branch_taken, reasoning_summary, contribution_summary, confidence, trust_impact, locale, audience); template-based, deterministic.
3. **Customer narrative**: narrative_customer is customer-safe; no internal refs (contracts/enterprise-contract.md).

## Transformation (ECOL → EEL)

- **Input**: ECOL decision trace (decision_id, outcome = approve), reasoning trace (steps leading to approve), influence records.
- **Output**: approval explanation with reasoning, contribution, confidence, trust impact, and narratives.
- **Pipeline**: trace-to-explanation (approval) → reasoning model → contribution model → narrative generation.

## Contract

- Approval explanation is produced by EEL pipeline; engine and ECOL unchanged.
- explanation_id and target_ref are immutable; audience determines narrative variants.
