# Decision Flow Model

## Definition

**Decision flow** is the sequence and branching of decisions within a trace. This model defines how decisions are ordered, how branches are taken, and how final outcomes are reached for cognitive observability.

## Decision Flow Schema

```yaml
decision_id: string
trace_id: string
sequence: integer
timestamp: ISO8601

decision_type: enum [binary | multi_way | continuous | delegation | fallback]
domain: string
component: string

# Inputs (references)
input_refs: string[]  # reasoning steps or prior decisions that fed this decision
context_ref: string | null

# Outcome
outcome_ref: string  # artifact or branch id
outcome_type: enum [approve | deny | refer | defer | custom]
branch_taken: string | null  # branch id or label

# Causality
parent_decision_id: string | null
child_decision_ids: string[]
```

## Decision Types (Semantics)

| Type | Description | Observable |
|------|-------------|------------|
| **binary** | Two-way (e.g. pass/fail) | branch_taken |
| **multi_way** | N-way (e.g. tier 1/2/3) | branch_taken |
| **continuous** | Numeric or range (e.g. limit amount) | outcome_ref |
| **delegation** | Delegated to sub-engine or service | child_decision_ids |
| **fallback** | Fallback path taken | branch_taken = fallback |

## Flow Structure

- **Sequence**: `sequence` orders decisions within trace; concurrent decisions may share sequence and be distinguished by decision_id.
- **Tree/DAG**: parent_decision_id and child_decision_ids form a tree or DAG of decision hierarchy (e.g. top-level decision → sub-decisions).
- **Branch**: branch_taken identifies which alternative was selected at this decision point.

## Propagation Rules

1. **Input binding**: Every decision has at least one input_ref (reasoning step or prior decision) unless it is the first decision in the trace.
2. **Outcome binding**: Every decision has exactly one outcome_ref (artifact or branch id).
3. **Hierarchy**: child_decision_ids are decisions that were triggered or delegated by this decision; parent_decision_id is the reverse link.

## Relationship to Decision Graph

- decision-flow is the linear/tree view of decisions; decision-graph is the full graph including reasoning nodes and inputs. Decision flow nodes are a subset of decision graph nodes (decision_point and output).

## Contract

- Decision flow events are emitted when a decision is made (at instrumentation boundary).
- Additive only; no change to decision logic.
