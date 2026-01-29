# Model Influence Model

## Definition

**Model influence** is the effect of a specific model (version, type) on decisions and outcomes across traces. This model defines how to aggregate and query model influence for governance and audit—without altering model logic.

## Model Influence Schema (Aggregate View)

```yaml
model_id: string
model_version: string | null
model_type: enum [classifier | regressor | recommender | embedding | generative | hybrid]

# Aggregate (over time or scope)
trace_count: integer  # traces where this model contributed
decision_count: integer  # decisions influenced
contribution_sum: float | null  # sum of contribution (for normalization)
contribution_mean: float | null
contribution_std: float | null

# Scope
scope: enum [time_range | domain | global]
scope_ref: string | null  # e.g. time range, domain id
computed_at: ISO8601
```

## Propagation Rules

1. **Aggregation**: Model influence aggregate is computed from AI contribution or AI influence records (influence/ai-influence.md) filtered by model_id and optional scope.
2. **Scope**: scope = time_range | domain | global; scope_ref holds the filter (e.g. start/end time, domain id).
3. **No production impact**: Aggregation is done in analysis or batch; production does not depend on it.

## Relationship to Other Models

- **AI contribution**: ai-observability/ai-contribution.md is the per-trace record; model influence is the aggregate view.
- **AI influence**: influence/ai-influence.md is the per-decision influence; model influence aggregates over traces/decisions.
- **Inference impact**: ai-observability/inference-impact.md is per-inference; model influence is per-model aggregate.

## Contract

- Model influence aggregates are produced by a dedicated analysis or query; no change to model or inference code.
- ECOL defines the schema; implementation may use different aggregation windows and filters.
