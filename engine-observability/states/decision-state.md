# Decision State Model

## Definition

**Decision state** is a snapshot of the state of one or more decisions: pending, in-progress, or completed; inputs consumed; outcome produced. This model defines the structure for observability of decision progress.

## Decision State Schema

```yaml
state_id: string
trace_id: string
timestamp: ISO8601

decision_id: string
status: enum [pending | in_progress | completed | failed | delegated]

# Inputs (when in_progress or completed)
input_refs: string[]
context_ref: string | null

# Outcome (when completed)
outcome_ref: string | null
outcome_type: enum [approve | deny | refer | defer | custom] | null
branch_taken: string | null

# Delegation (when delegated)
delegate_ref: string | null
child_decision_ids: string[]

# Failure (when failed)
failure_ref: string | null
```

## Status Semantics

| Status | Description |
|--------|-------------|
| **pending** | Decision not yet started |
| **in_progress** | Inputs gathered, evaluation in progress |
| **completed** | Outcome produced |
| **failed** | Decision failed (failure_ref set) |
| **delegated** | Delegated to child decisions (child_decision_ids set) |

## Propagation Rules

1. **Status transitions**: pending → in_progress → completed | failed | delegated; no backward transitions in normal flow.
2. **Outcome binding**: When status = completed, outcome_ref and outcome_type must be set.
3. **Trace binding**: state_id and trace_id bind this snapshot to a trace.

## Relationship to Decision Flow

- Decision flow (flows/decision-flow.md) records the sequence of decisions; decision state is a snapshot of a single decision at a point in time. Multiple state snapshots for the same decision_id show progress.

## Contract

- Decision state snapshots are emitted at instrumentation boundaries (e.g. decision start, decision complete).
- Additive only; no change to decision logic.
