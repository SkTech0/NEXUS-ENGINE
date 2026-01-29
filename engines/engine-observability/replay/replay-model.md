# Replay Model

## Definition

**Replay** is the reconstruction and re-execution (logical or actual) of a past cognitive run for audit, debugging, or analysis. This model defines replay semantics: what can be replayed, inputs required, and guarantees—without altering production logic.

## Replay Types

| Type | Description | Use |
|------|-------------|-----|
| **Timeline reconstruction** | Reconstruct ordering and causality from traces | Audit, visualization |
| **Determinism replay** | Re-run with same inputs and seed (if applicable) | Reproducibility, testing |
| **Audit replay** | Reconstruct decision path and reasoning for audit | Compliance, explainability |

## Replay Request Schema

```yaml
replay_id: string
replay_type: enum [timeline | determinism | audit]
trace_id: string  # original trace to replay or reconstruct

# Inputs (for determinism replay)
input_snapshot_ref: string | null  # captured inputs for replay
seed: number | null  # for stochastic replay
as_of_timestamp: ISO8601 | null  # state of engine/rules as of time (if supported)

# Scope
scope: enum [full | decision_only | reasoning_only | failure_recovery]
```

## Replay Result Schema

```yaml
replay_id: string
status: enum [completed | partial | failed]
started_at: ISO8601
ended_at: ISO8601 | null

# For timeline/audit
reconstructed_trace_ref: string | null  # trace or graph reconstructed
decision_graph_ref: string | null
reasoning_trace_ref: string | null

# For determinism
output_match: boolean | null  # true if re-run output matches original
diff_ref: string | null  # reference to diff if mismatch

# For audit
audit_artifact_ref: string | null  # report or artifact for audit
```

## Propagation Rules

1. **Trace binding**: Replay is always bound to an original trace_id (or equivalent) for correlation.
2. **Scope**: full = entire run; decision_only = decision flow and outcomes; reasoning_only = reasoning steps; failure_recovery = failure and recovery traces.
3. **No side effects in production**: Replay for audit/timeline is read-only reconstruction; determinism replay may run in isolated environment.

## Relationship to Other Models

- **Timeline reconstruction**: replay/timeline-reconstruction.md details how to build timeline from traces.
- **Determinism replay**: replay/determinism-replay.md details requirements for reproducible replay.
- **Audit replay**: replay/audit-replay.md details audit-specific replay and artifacts.

## Contract

- Replay is performed by a dedicated replay service or tooling; ECOL defines the model and required data (traces, inputs, state).
- Production engine is not modified for replay; replay uses captured data and optional isolated execution.
