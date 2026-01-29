# Confidence Flow Model

## Definition

**Confidence flow** is the propagation of confidence scores (and updates) through reasoning steps and decisions. This model defines how confidence is observed over time for cognitive observability.

## Confidence Flow Schema

```yaml
confidence_event_id: string
trace_id: string
sequence: integer
timestamp: ISO8601

ref_type: enum [reasoning_step | decision | output | model]
ref_id: string  # step_id, decision_id, output_ref, or model_id

confidence: float  # [0,1]
uncertainty: float | null  # [0,1] or complementary
source: enum [rule | model | aggregation | human | default]
aggregation_method: string | null  # when source = aggregation

# Propagation
input_confidence_refs: string[]  # prior confidence events that were combined
propagated_to: string[]  # ref_ids that consumed this confidence
```

## Source Types (Semantics)

| Source | Description |
|--------|-------------|
| **rule** | Confidence from rule or policy (e.g. fixed or derived) |
| **model** | Confidence from model (e.g. classifier probability) |
| **aggregation** | Combined from multiple inputs (e.g. min, product, weighted) |
| **human** | Human-provided or override |
| **default** | Default when no other source |

## Propagation Rules

1. **Monotonic sequence**: sequence is monotonic per trace.
2. **Ref binding**: Every confidence event is attached to a ref (step, decision, output, or model).
3. **Aggregation**: When source is aggregation, input_confidence_refs list the events that were combined; aggregation_method describes how (e.g. min, product).
4. **Flow**: propagated_to links this confidence to downstream refs that consumed it (e.g. next step or decision).

## Relationship to Other Models

- **Confidence model**: trust-confidence/confidence-model.md defines confidence semantics and aggregation; this document defines the flow events.
- **Decision graph**: Confidence events can annotate nodes (step_id, decision_id) in the decision graph.
- **Uncertainty**: trust-confidence/uncertainty-model.md defines uncertainty; confidence and uncertainty can be complementary or independent.

## Contract

- Confidence flow events are emitted when confidence is produced or updated (at instrumentation boundary).
- Additive only; no change to how confidence is computed in business logic.
