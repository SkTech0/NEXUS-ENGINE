# Cognition Model

## Definition

**Cognition** in ECOL is the union of perception (inputs), reasoning (inference and rules), and decision (choices and outputs) that the engine performs. The cognition model defines the state and flow of this process for observability.

## Cognitive Phases

| Phase | Description | Observable artifact |
|-------|-------------|---------------------|
| **Ingestion** | Receipt and normalization of inputs | input_set, schema_validity |
| **Context** | Assembly of context (rules, constraints, prior state) | context_ref, scope |
| **Reasoning** | Application of rules, constraints, inference | reasoning_steps (see reasoning-model) |
| **Decision** | Selection among alternatives or production of output | decision_point, outcome |
| **Emission** | Output production and side effects | output_set, downstream_refs |

## Cognitive State (Summary)

A snapshot of the engine’s cognitive state at a point in time includes:

- **Active inputs**: Set of input refs currently in scope.
- **Active context**: Rules, constraints, and parameters in use.
- **Current reasoning stack**: Stack or DAG of in-flight reasoning steps.
- **Pending decisions**: Decision points not yet resolved.
- **Produced outputs**: Outputs emitted in this cognitive run.

Full state schema is in `states/cognitive-state.md`.

## Cognition Run Schema

```yaml
cognition_run_id: string
trace_id: string
started_at: ISO8601
ended_at: ISO8601 | null

trigger: enum [request | event | schedule | recovery]
trigger_ref: string | null

phases_completed: enum [ingestion | context | reasoning | decision | emission][]
current_phase: string | null

input_count: integer
reasoning_step_count: integer
decision_point_count: integer
output_count: integer

domain: string
component: string
```

## Relationships to Other Models

- **Decision graph**: One cognition run may produce one or more decision graphs (e.g. one per top-level decision).
- **Reasoning model**: Reasoning steps are the reasoning phase instantiation.
- **Inference flow**: Describes the data flow through inference (see inference-flow.md).
- **States**: Cognitive state is the mutable snapshot; cognition run is the bounded execution.

## Propagation Rules

1. **Phase order**: Phases are observed in order: ingestion → context → reasoning → decision → emission. Overlap is allowed (e.g. streaming).
2. **Run boundary**: A cognition run starts at trigger and ends when emission is complete or the run is aborted.
3. **Trace binding**: One cognition run maps to one primary trace_id; sub-traces may exist for delegated work.

## Contract

- Cognition runs are identified by `cognition_run_id` and `trace_id`.
- Observation is additive: phases and counts are recorded as they occur without changing control flow.
- Correlation with execution traces is via `trace_id` and optional `span_id` in integration layer.
