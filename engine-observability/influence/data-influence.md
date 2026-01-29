# Data Influence Model

## Definition

**Data influence** is the contribution of input data (fields, entities, prior outputs) to decisions and outputs. This model defines how to attribute outcomes to specific data sources for explainability, fairness, and audit.

## Data Influence Schema

```yaml
influence_id: string
trace_id: string

data_source: enum [input_field | entity | prior_output | cache | external_system]
source_ref: string  # field path, entity_id, artifact_ref, or system id
source_name: string | null  # human-readable (e.g. applicant_income)

influenced_ref: string  # decision_id, step_id, or output_ref
contribution: float | null  # [0,1] normalized contribution
sensitivity: enum [direct | indirect | derived]
evidence: string | null  # e.g. rule that consumed this field
```

## Data Source Types

| Source | Description | Ref format |
|--------|-------------|------------|
| **input_field** | Request or event payload field | path (e.g. payload.income) |
| **entity** | Persistent entity (e.g. customer, application) | entity_id + optional version |
| **prior_output** | Output of a previous run or step | artifact_ref |
| **cache** | Cached value | cache_key or ref |
| **external_system** | Third-party or upstream system | system_id + response_ref |

## Sensitivity (Semantics)

- **direct**: The data value was directly used in a rule or model input (e.g. field in condition).
- **indirect**: The data affected an intermediate result that then affected the outcome.
- **derived**: The data was transformed or aggregated before use; contribution is to the derived value.

## Propagation Rules

1. **Trace binding**: All data influence is scoped to trace_id.
2. **Attribution**: Every recorded data influence has at least one influenced_ref; multiple source_refs can influence the same ref.
3. **Sum**: For a single influenced_ref, sum of contribution across data influences can be used for contribution breakdown; normalization is implementation-specific.

## Relationship to Fairness and Compliance

- Data influence supports “which inputs drove this outcome?” for fairness and regulatory explanation.
- Sensitive fields (e.g. protected attributes) can be tagged in source_name or metadata for special handling in explainability.

## Contract

- Data influence is recorded when input or entity data is consumed by a reasoning step or decision.
- Recording is additive at instrumentation boundaries; no change to data access logic.
