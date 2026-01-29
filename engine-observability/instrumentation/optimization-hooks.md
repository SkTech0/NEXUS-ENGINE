# Optimization Hooks (Declarative Instrumentation)

## Definition

**Optimization hooks** are the points at which optimization observability attaches: when optimization runs, constraints are evaluated, tradeoffs are applied, and frontier points are selected. This document defines WHERE and HOW to attach—declarative only; no code changes to optimization logic.

## Design Principles

1. **Additive only**: Hooks observe and emit; they do not modify solver, constraints, or selection.
2. **Declarative**: Location and payload are specified; implementation is separate.
3. **No mocks**: Hooks emit real optimization data from real execution.

## Hook Points

### OPT-1: Optimization Run Start

**Location**: At the entry of an optimization run (solver, constraint satisfaction, objective evaluation).

**When**: Before solver or evaluator runs.

**Payload (emit)**:
- path_id, trace_id, started_at (see optimization/optimization-paths.md)
- optimization_type (single_objective | multi_objective | constraint_satisfaction)
- solver_ref, objective_refs, constraint_refs

**Source model**: optimization/optimization-paths.md.

**Implementation note**: Allocate path_id; emit once per optimization run. No change to solver.

---

### OPT-2: Optimization Step (Optional)

**Location**: At each solver step or constraint evaluation (if granularity is desired).

**When**: After step completes.

**Payload (emit)**:
- path_id, trace_id, step_id, sequence, timestamp
- step_type (evaluate | constraint_check | solve | select)
- input_ref, output_ref, objective_value, constraint_slacks (optional)

**Source model**: optimization/optimization-paths.md (steps).

**Implementation note**: Optional; use when step-level audit is needed. No change to step logic.

---

### OPT-3: Optimization Run End (Selected Point)

**Location**: At the exit of an optimization run (after solution is selected).

**When**: After solver or selector returns.

**Payload (emit)**:
- path_id, trace_id, ended_at
- selected_point_ref, frontier_ref (optional)
- steps (optional; if not emitted incrementally)

**Source model**: optimization/optimization-paths.md.

**Implementation note**: Emit selected_point_ref for influence linkage. No change to selection logic.

---

### OPT-4: Constraint Evaluated

**Location**: When a constraint is evaluated (satisfied, slack, binding).

**When**: After constraint check completes.

**Payload (emit)**:
- constraint_id, trace_id, timestamp (see optimization/constraint-model.md)
- constraint_type, constraint_ref, satisfied, slack, binding, shadow_price (optional)
- domain, component

**Source model**: optimization/constraint-model.md.

**Implementation note**: Emit when constraint is checked. No change to constraint evaluation.

---

### OPT-5: Tradeoff Applied (Optional)

**Location**: When a multi-objective tradeoff is applied (weights, selected point on frontier).

**When**: After tradeoff selection or at decision that used tradeoff.

**Payload (emit)**:
- tradeoff_id, trace_id, timestamp (see optimization/tradeoff-model.md)
- objective_refs, weights, weight_type
- selected_point_ref, objective_values, frontier_ref, point_on_frontier (optional)

**Source model**: optimization/tradeoff-model.md.

**Implementation note**: Emit when tradeoff is used in decision. No change to weighting or selection.

---

### OPT-6: Optimization Influence (Decision)

**Location**: When optimization result (selected point, binding constraint, shadow price) is used in a decision.

**When**: At decision entry when optimization output is input; or at decision end when outcome was constrained by optimization.

**Payload (emit)**:
- influence_id, trace_id (see influence/optimization-influence.md)
- optimization_ref, optimization_type, component
- influenced_ref, influence_type (binding | slack | shadow_price | selected_point), value, constraint_ref (optional)

**Source model**: influence/optimization-influence.md.

**Implementation note**: Emit when decision consumes optimization result. No change to decision logic.

---

## Attachment Contract

- **Where**: Entry/exit of optimization run; optional step boundaries; constraint evaluation; optional tradeoff; decision entry when optimization is input.
- **How**: Interceptor or callback that reads solver/constraint/tradeoff context and decision ref; emits to ECOL backend. No change to solver, constraint, or decision logic.
- **Backward compatibility**: If ECOL backend is unavailable, hook may no-op; optimization behavior is unchanged.
