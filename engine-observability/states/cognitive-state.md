# Cognitive State Model

## Definition

**Cognitive state** is a snapshot of the engine’s reasoning and decision state at a point in time: active inputs, context, in-flight reasoning, pending decisions, and produced outputs. This model defines the structure of that snapshot for observability.

## Cognitive State Schema

```yaml
state_id: string
trace_id: string
timestamp: ISO8601

# Phase
current_phase: enum [ingestion | context | reasoning | decision | emission]
phases_completed: list of enum (same values)

# Active sets (references only)
active_input_refs: string[]
active_context_refs: string[]  # rules, constraints, parameters
active_reasoning_step_ids: string[]  # in-flight steps
pending_decision_ids: string[]
produced_output_refs: string[]

# Counts (denormalized for query)
input_count: integer
reasoning_step_count: integer
decision_count: integer
output_count: integer

# Optional
domain: string | null
component: string | null
```

## Phase Semantics

| Phase | Description | Active sets |
|-------|-------------|-------------|
| **ingestion** | Receiving inputs | active_input_refs growing |
| **context** | Loading rules, constraints | active_context_refs set |
| **reasoning** | Applying rules, inference | active_reasoning_step_ids non-empty |
| **decision** | Making choices | pending_decision_ids, then produced |
| **emission** | Emitting outputs | produced_output_refs complete |

## Propagation Rules

1. **Monotonic phases**: phases_completed only grows; current_phase advances.
2. **Consistency**: Counts should match lengths of active/produced sets at snapshot time (or be explicitly denormalized).
3. **Trace binding**: state_id and trace_id bind this snapshot to a trace; one trace can have multiple state snapshots over time.

## Relationship to Other Models

- **Cognition model**: cognition-model.md defines cognition run; cognitive state is a point-in-time snapshot within a run.
- **Decision state**: decision-state.md focuses on decision-specific state; cognitive state is broader.
- **Engine state**: engine-state.md is runtime/operational; cognitive state is logical/cognitive.

## Contract

- Cognitive state snapshots are emitted at instrumentation boundaries (e.g. phase transitions or periodic).
- Additive only; no change to control flow or business logic.
