# Audit Replay Model

## Definition

**Audit replay** is the reconstruction of decision path, reasoning, and causality for compliance and audit. This model defines what audit artifacts are produced and how they are structured—without altering production logic.

## Audit Replay Schema

```yaml
audit_replay_id: string
trace_id: string
requested_at: ISO8601
completed_at: ISO8601 | null

# Scope
scope: enum [full | decision_path | reasoning_path | influence | failure_recovery]
entity_ref: string | null  # e.g. application_id, loan_id

# Reconstructed artifacts (references)
decision_graph_ref: string
reasoning_trace_ref: string | null
timeline_ref: string | null
influence_report_ref: string | null  # contribution breakdown
causality_report_ref: string | null

# Audit artifact
audit_artifact_ref: string  # report, bundle, or export for auditor
audit_artifact_type: enum [report | bundle | export]
format: string | null  # e.g. JSON, PDF
```

## Audit Artifact Contents (Logical)

- **Decision graph**: Full graph (inputs, reasoning, decisions, outputs) for the trace.
- **Reasoning trace**: Ordered reasoning steps with inputs and conclusions.
- **Timeline**: Chronological events (reconstructed from timeline-reconstruction.md).
- **Influence report**: Contribution of data, engine, AI, trust, optimization (from influence/*).
- **Causality report**: Cause-effect pairs (from causality/causality-model.md).
- **Failure/recovery**: If applicable, failure trace and recovery trace refs.

## Propagation Rules

1. **Trace binding**: audit_replay is always for a specific trace_id (and optionally entity_ref).
2. **Immutability**: Audit artifact is immutable once produced; regeneration creates new artifact_ref.
3. **Retention**: Audit artifacts may be subject to retention policy; ECOL does not define policy, only structure.

## Relationship to Other Models

- **Replay model**: replay-model.md replay_type=audit; this document details audit-specific output.
- **Decision graph**: cognition/decision-graph.md is the primary structure for “why” explanation.
- **Explainability**: trust-confidence/explainability.md defines explainability; audit replay is one consumer.

## Contract

- Audit replay is performed by a dedicated audit service or tooling; production engine is not modified.
- Audit artifact format and retention are implementation and policy concerns; ECOL defines logical content.
