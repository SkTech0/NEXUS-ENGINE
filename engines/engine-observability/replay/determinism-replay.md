# Determinism Replay Model

## Definition

**Determinism replay** is the re-execution of a cognitive run with the same inputs (and optionally same seed and as-of state) to reproduce the same outcome. This model defines requirements and structure for reproducible replay—without altering production logic.

## Requirements for Determinism

1. **Input capture**: All inputs (request payload, entity state, context) that affected the original run must be available for replay.
2. **Seed**: For stochastic components (e.g. ML inference with sampling), seed must be captured and re-used.
3. **As-of state**: Rules, models, and config as of original timestamp should be used if replay must match exactly (versioned rules/models).
4. **Isolation**: Replay should run in isolation (e.g. test env) to avoid side effects and ensure determinism.

## Determinism Replay Schema

```yaml
replay_id: string
replay_type: "determinism"
original_trace_id: string
requested_at: ISO8601

# Captured inputs (references)
input_snapshot_ref: string  # ref to stored snapshot of inputs
seed: number | null
as_of_timestamp: ISO8601 | null
rule_version_ref: string | null
model_version_ref: string | null

# Execution
replay_trace_id: string | null  # trace of the replay run
output_ref: string | null      # output of replay run

# Comparison
output_match: boolean  # true if replay output matches original output
diff_ref: string | null  # ref to diff or mismatch report
match_criteria: string | null  # e.g. "exact", "decision_only"
```

## Match Criteria

| Criteria | Description |
|----------|-------------|
| **exact** | Full output (and optionally intermediate) matches |
| **decision_only** | Final decision/outcome matches |
| **reasoning_only** | Reasoning steps match (order and conclusions) |
| **tolerance** | Numeric tolerance for floats (e.g. confidence) |

## Propagation Rules

1. **Input snapshot**: input_snapshot_ref must point to a complete snapshot (payload, entity state, context) at original run time.
2. **Output comparison**: output_match is true only if re-run output satisfies match_criteria against original; diff_ref holds details when false.
3. **No production impact**: Replay runs in isolated environment; production traces and data are read-only.

## Relationship to Replay Model

- replay-model.md defines general replay; this document specializes for determinism and reproducibility.
- Audit replay may use determinism replay to verify “same inputs → same outcome” for compliance.

## Contract

- Determinism replay is best-effort when engine has non-deterministic components (e.g. external calls, wall-clock); document limitations.
- Production engine is not modified; replay uses captured data and isolated execution.
