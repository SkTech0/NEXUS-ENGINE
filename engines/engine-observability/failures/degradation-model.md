# Degradation Model

## Definition

**Degradation** is a reduction in capability or quality without full failure: fallback active, reduced accuracy, delayed response, or partial availability. This model defines how degradation is represented for cognitive observability—without altering degradation logic.

## Degradation Schema

```yaml
degradation_id: string
trace_id: string | null
timestamp: ISO8601

degradation_type: enum [fallback_active | reduced_accuracy | latency | partial_availability | capacity_limited]
scope: enum [component | service | domain | global]
ref: string  # component_id, service_id, or domain

# Context
trigger_ref: string | null  # failure, overload, or policy that caused degradation
message: string | null
severity: enum [low | medium | high]

# Effect (observable)
effect_on_cognition: enum [none | fallback_used | reduced_confidence | delayed] | null
fallback_path_ref: string | null  # when fallback_active
```

## Degradation Types (Semantics)

| Type | Description |
|------|-------------|
| **fallback_active** | Fallback path is in use (e.g. cache, default, alternate service) |
| **reduced_accuracy** | Model or rule output is known to be less accurate |
| **latency** | Response delayed beyond normal |
| **partial_availability** | Some instances or features unavailable |
| **capacity_limited** | Throttling or queue limit in effect |

## Propagation Rules

1. **Scope**: degradation is scoped to component, service, domain, or global; ref identifies the affected entity.
2. **Trigger**: trigger_ref links to failure or event that caused degradation (optional).
3. **Effect on cognition**: When degradation affects reasoning or decision (e.g. fallback used), effect_on_cognition and fallback_path_ref record it for explainability.

## Relationship to Other Models

- **Fallback**: failures/fallback-model.md defines fallback behavior; degradation with type fallback_active records that fallback is in effect.
- **Engine state**: states/engine-state.md mode=degraded can be correlated with degradation_id.
- **Recovery**: recovery/stabilization.md defines return to normal; degradation may end when recovery completes.

## Contract

- Degradation is recorded when observed (at instrumentation boundaries); no change to degradation or fallback logic.
- effect_on_cognition is optional but recommended when degradation affects decision path or confidence.
