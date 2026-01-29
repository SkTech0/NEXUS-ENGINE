# Explainability Model

## Definition

**Explainability** in ECOL is the structured representation of “why” an outcome or decision occurred: contribution breakdown, reasoning path, and evidence. This model defines how explanations are structured for observability—without altering decision logic.

## Explanation Schema

```yaml
explanation_id: string
trace_id: string
timestamp: ISO8601

# Target
target_type: enum [decision | output | reasoning_step]
target_ref: string  # decision_id, output_ref, step_id

# Content (references and summaries)
reasoning_path_ref: string | null  # decision graph or reasoning trace
contribution_breakdown: list of:
  contributor_type: enum [data | engine | ai | trust | optimization]
  contributor_ref: string
  contribution: float  # [0,1] normalized
  evidence_ref: string | null

# Optional
summary: string | null  # human-readable summary
locale: string | null
```

## Contribution Breakdown Rules

1. **Normalization**: Sum of contribution across contributors should be ≤ 1 (or document normalization in metadata).
2. **Contributor types**: data = data influence; engine = engine influence; ai = AI influence; trust = trust influence; optimization = optimization influence (see influence/*).
3. **Evidence**: evidence_ref links to rule, step, or artifact that supports this contributor.

## Propagation Rules

1. **Target binding**: Every explanation is for one target (decision, output, or reasoning step).
2. **Trace binding**: explanation is always for a trace_id.
3. **Reasoning path**: reasoning_path_ref points to decision graph or reasoning trace for full path; contribution_breakdown is the summary view.

## Relationship to Other Models

- **Decision graph**: cognition/decision-graph.md is the full “why” graph; explanation is a view or summary.
- **Influence**: influence/* provides the raw influence records; contribution_breakdown aggregates them.
- **Audit**: replay/audit-replay.md produces audit artifacts; explanation is a component of explainability in audit.

## Contract

- Explanations are produced by a dedicated explainability service or at instrumentation boundary; no change to decision logic.
- summary is optional and may be generated (e.g. from template or NLG); ECOL does not define generation logic.
