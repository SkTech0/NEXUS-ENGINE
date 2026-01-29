# Trace to Explanation Mapping

## Definition

This document defines how ECOL traces (reasoning, decision, failure, recovery) and related entities map to EEL explanation requests and payloads. It is the primary mapping for "given a trace and target, produce an explanation."

## Request to ECOL Query

- **Input**: trace_id, target_ref, target_type (optional), locale, audience.
- **ECOL query**: 
  - Fetch reasoning trace for trace_id (engine-observability/traces/reasoning-trace.md).
  - Fetch decision trace for trace_id (engine-observability/traces/decision-trace.md).
  - Fetch decision graph for trace_id (engine-observability/cognition/decision-graph.md) if decision_graph_ref present in trace.
  - Fetch influence records where influenced_ref = target_ref or decision_id in trace (engine-observability/influence/*).
  - Fetch causality edges where effect_ref = target_ref (engine-observability/causality/causality-model.md).
  - Fetch confidence flow events for target_ref or trace_id (engine-observability/flows/confidence-flow.md).
  - Fetch trust flow and trust influence for target_ref (engine-observability/flows/trust-flow.md, influence/trust-influence.md).
  - Fetch risk flow for target_ref (engine-observability/flows/risk-flow.md).
  - If target_type = failure or target_ref = failure_id: fetch failure trace, cascade (engine-observability/traces/failure-trace.md, failures/cascade-model.md).
  - If target_type = recovery or target_ref = recovery_id: fetch recovery trace (engine-observability/traces/recovery-trace.md).
  - If target_type = fallback: fetch fallback record (engine-observability/failures/fallback-model.md).

## Target Type Inference

When target_type is not provided:
- If target_ref = decision_id (from decision trace) → target_type = decision; then outcome_type (approve/deny/refer) → approval, rejection, or review.
- If target_ref = output_ref or artifact_ref → target_type = outcome.
- If target_ref = failure_id → target_type = failure.
- If target_ref = recovery_id → target_type = recovery.
- If target_ref = fallback_id → target_type = fallback.

## Trace to Explanation Type

| ECOL data | EEL explanation type |
|-----------|----------------------|
| decision_trace.decisions[] where decision_id = target_ref; outcome_type = approve | approval |
| decision_trace.decisions[] where decision_id = target_ref; outcome_type = deny | rejection |
| decision_trace.decisions[] where decision_id = target_ref; outcome_type = refer | review |
| decision_trace.decisions[] where decision_id = target_ref | decision |
| decision graph node type=output, artifact_ref = target_ref | outcome |
| fallback record fallback_id = target_ref | fallback |
| recovery trace recovery_id = target_ref | recovery |
| failure trace primary_failure_id or failure_id = target_ref | failure |

## Payload Assembly

1. **Base**: explanation_id (generate), trace_id, target_ref, target_type, generated_at, locale, audience.
2. **Reasoning**: From reasoning trace (steps feeding target_ref); apply reasoning-model transformation; set reasoning_path_ref, reasoning_summary, reasoning_steps.
3. **Cause**: From causality backward from target_ref; apply cause-model transformation; set cause_chain_ref, cause_summary, immediate_cause_ref, root_cause_ref when applicable.
4. **Contribution**: From influence records for target_ref; apply contribution-model transformation; set contribution_breakdown, contribution_summary.
5. **Confidence**: From confidence flow for target_ref; apply confidence-model transformation; set confidence, confidence_explanation, uncertainty, uncertainty_explanation.
6. **Risk**: From risk flow for target_ref; apply risk-model transformation; set risk_level, risk_explanation when applicable.
7. **Trust**: From trust influence for target_ref; apply trust-model transformation; set trust_impact, trust_explanation when applicable.
8. **Narrative**: Apply graph-to-narrative and cognition-to-language (mappings/graph-to-narrative.md, cognition-to-language.md) with assembled model; set narrative, narrative_short, narrative_audit, narrative_regulator, narrative_customer per audience.

## Contract

- Trace-to-explanation is implemented by EEL pipeline; engine and ECOL are not modified.
- Missing trace or target_ref results in 404; partial ECOL data results in partial explanation (contracts/explanation-contract.md).
