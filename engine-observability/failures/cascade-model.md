# Cascade Model

## Definition

**Cascade** is the propagation of a failure from one component or step to another. This model defines how failure propagation is represented: dependency chain, hop count, and affected refs—without altering propagation logic.

## Cascade Edge Schema

```yaml
cascade_id: string
trace_id: string | null

source_failure_id: string
target_ref: string  # component, step, or resource that failed as a result
target_failure_id: string | null  # if a new failure was recorded for target

hop: integer  # 0 = source is root; 1 = first cascade level
path: list of refs  # optional path from source to target
timestamp: ISO8601
```

## Cascade Graph

- **Nodes**: Failures (failure_id) and optionally affected refs (components, steps).
- **Edges**: Cascade edges from source_failure_id to target_failure_id or target_ref.
- **Properties**: Directed graph; acyclic for single root (one failure does not cause itself); multiple roots possible (multiple independent failures).

## Propagation Rules

1. **Hop semantics**: Root failure has hop = 0; each downstream propagation increments hop.
2. **Temporal order**: Cascade edge timestamp >= source failure timestamp.
3. **Path**: When path is recorded, it lists the refs (components/steps) through which failure propagated; supports “failure path” visualization.

## Relationship to Other Models

- **Failure model**: failures/failure-model.md defines failure; cascade links failures.
- **Failure trace**: traces/failure-trace.md contains cascade list as part of the trace.
- **Propagation**: causality/propagation.md defines general propagation; cascade is failure-specific propagation.

## Contract

- Cascade edges are recorded when a failure is observed to cause another (at instrumentation or analysis); no change to error propagation logic.
- Cascade can be built incrementally (each new failure links to parent_failure_id in failure trace).
