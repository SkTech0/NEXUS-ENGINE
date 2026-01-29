# Contribution Model (Explainability)

## Definition

The **contribution model** for explainability is the representation of how much each contributor (data, engine, AI, trust, optimization) contributed to an outcome, in a form suitable for human interpretation. It is derived from ECOL influence records—without altering engine behavior.

## Contribution Explanation Structure

```yaml
contribution_explanation_id: string
trace_id: string
target_ref: string  # decision_id or output_ref
generated_at: ISO8601
locale: string

# Breakdown (from ECOL influence)
breakdown: list of:
  contributor_type: enum [data | engine | ai | trust | optimization]
  contributor_ref: string  # field path, rule_id, model_id, trust_ref, optimization_ref
  contributor_name: string | null  # human-readable name (e.g. "Applicant income")
  contribution: float  # [0,1] normalized
  rank: integer | null  # 1 = highest contributor
  evidence_ref: string | null
  contribution_readable: string | null  # e.g. "Data: Applicant income contributed 0.35"

# Summary
summary: string  # human-readable summary of contribution breakdown
total_contributors: integer
primary_contributor_type: string  # contributor_type with max contribution
primary_contributor_ref: string
normalized: boolean  # true if sum(contribution) <= 1
```

## Deterministic Rules

1. **Normalization**: contribution values are normalized so sum ≤ 1; if raw sum > 1, scale by sum; document in normalized.
2. **Rank**: rank is assigned by descending contribution; 1 = highest.
3. **Primary**: primary_contributor_type and primary_contributor_ref are the contributor with maximum contribution.
4. **Contribution readable**: contribution_readable = f(contributor_type, contributor_name, contribution, locale); deterministic template.

## Transformation (ECOL → EEL)

- **Input**: ECOL influence records (engine-influence, data-influence, ai-influence, trust-influence, optimization-influence) for target_ref.
- **Output**: breakdown with contribution normalized; contributor_name from ECOL ref + optional catalog (mappings).
- **Rules**: Aggregate by contributor_type and contributor_ref; sum contribution per (type, ref); then normalize across all.

## Contract

- Contribution explanation is read-only over ECOL influence; no change to engine logic.
- contribution_explanation_id is immutable; target_ref and trace_id are required for audit.
