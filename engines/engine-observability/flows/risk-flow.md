# Risk Flow Model

## Definition

**Risk flow** is the propagation of risk signals (scores, flags, tiers) through the engine. This model defines how risk is observed over time for cognitive observability and governance.

## Risk Flow Schema

```yaml
risk_event_id: string
trace_id: string
sequence: integer
timestamp: ISO8601

ref_type: enum [input | entity | decision | output]
ref_id: string

risk_score: float | null  # [0,1] or tier
risk_tier: string | null  # e.g. low, medium, high
risk_type: string | null  # e.g. fraud, credit, compliance
source: enum [rule | model | policy | aggregation]

# Propagation
input_risk_refs: string[]
propagated_to: string[]
effect: enum [escalate | refer | deny | allow | mitigate] | null
```

## Propagation Rules

1. **Monotonic sequence**: sequence is monotonic per trace.
2. **Ref binding**: Every risk event is attached to a ref (input, entity, decision, or output).
3. **Effect**: When risk affects a decision, effect (escalate, refer, deny, allow, mitigate) can be recorded at the consumer.
4. **Flow**: input_risk_refs and propagated_to form a flow graph of risk through the system.

## Relationship to Other Models

- **Trust/confidence**: Risk can be inverse or complementary to trust; risk flow is modeled separately for governance and audit.
- **Decision flow**: Risk often gates or branches decisions (e.g. high risk → refer); risk_event can link to decision_id in propagated_to.
- **Failure**: High risk does not imply failure; failure is in failures/failure-model.md.

## Contract

- Risk flow events are emitted when risk is computed or updated and when it affects a decision (at instrumentation boundaries).
- Additive only; no change to risk computation or decision logic.
