# ECOL to EEL Mapping

## Definition

This document defines how ECOL (Engine Cognitive Observability Layer) structures map to EEL (Engine Explainability Layer) structures. All mappings are read-only transformations; engine and ECOL are unchanged.

## Pipeline Position

- **Input**: ECOL traces (reasoning, decision, failure, recovery), decision graph, influence records, causality records, flows (confidence, trust, risk), states, optimization paths, inference flow.
- **Output**: EEL explanation models (explanation-model, reasoning-model, cause-model, contribution-model, confidence-model, risk-model, trust-model, tradeoff-model, uncertainty-model) and explanation types (decision, outcome, rejection, approval, review, fallback, recovery, failure).
- **Position**: ECOL → causal models → influence models → reasoning models → EEL explanation models → human-readable narratives (see README pipeline).

## Mapping Tables

### Trace to Explanation Type

| ECOL trace / entity | EEL explanation type | Primary ECOL source |
|---------------------|----------------------|----------------------|
| decision_trace (outcome=approve) | approval | decision trace, reasoning trace, influence |
| decision_trace (outcome=deny) | rejection | decision trace, reasoning trace, cause, influence |
| decision_trace (outcome=refer) | review | decision trace, reasoning trace, cause, risk/confidence/trust |
| decision_trace (any) | decision | decision trace, reasoning trace, influence, cause (optional) |
| output_ref / artifact | outcome | decision graph, reasoning trace, influence |
| fallback record | fallback | failures/fallback-model, recovery trace |
| recovery trace | recovery | traces/recovery-trace, recovery-model |
| failure trace | failure | traces/failure-trace, cascade, causality |

### Reasoning

| ECOL | EEL |
|------|-----|
| reasoning trace (steps) | reasoning_explanation.steps; step_id, sequence, reasoning_type, conclusion, output_ref, confidence |
| step conclusion | conclusion_readable = f(reasoning_type, conclusion, evidence_ref, locale) |
| reasoning trace | reasoning_explanation.summary = graph-to-narrative(reasoning trace, locale) |

### Cause

| ECOL | EEL |
|------|-----|
| causality (cause_ref → effect_ref) | cause_chain; traverse backward from target_ref to root |
| causality.strength | cause_chain[].strength; only direct/indirect in audit/regulator |
| dependency (depends_on_ref → dependent_ref) | dependency_chain; traverse backward from target_ref |

### Contribution

| ECOL | EEL |
|------|-----|
| engine-influence | contribution_breakdown[] contributor_type=engine, contributor_ref, contribution |
| data-influence | contribution_breakdown[] contributor_type=data, contributor_ref, contribution |
| ai-influence | contribution_breakdown[] contributor_type=ai, contributor_ref, contribution |
| trust-influence | contribution_breakdown[] contributor_type=trust, contributor_ref, contribution |
| optimization-influence | contribution_breakdown[] contributor_type=optimization, contributor_ref, contribution |
| Normalization | Sum contributions; scale to sum ≤ 1; set normalized=true |

### Confidence

| ECOL | EEL |
|------|-----|
| confidence flow event (ref_id, confidence, source) | confidence_explanation.confidence, confidence_source, confidence_readable |
| confidence_interpretation | f(confidence, thresholds) from governance |
| uncertainty (when present) | confidence_explanation.uncertainty, uncertainty_readable |

### Risk

| ECOL | EEL |
|------|-----|
| risk flow event (ref_id, risk_score, risk_tier, effect) | risk_explanation.risk_score, risk_tier, effect, risk_readable, effect_readable |
| risk_interpretation | f(risk_tier, risk_type, effect, locale) |

### Trust

| ECOL | EEL |
|------|-----|
| trust influence (source_ref, trust_score, effect) | trust_explanation.trust_score, effect, effect_outcome, effect_readable |
| trust_readable | f(trust_score, trust_dimension, locale) |

### Optimization

| ECOL | EEL |
|------|-----|
| optimization path (steps, selected_point_ref) | optimization_reasoning_explanation.steps, selected_point_ref; path_explanation |
| tradeoff (weights, selected_point) | tradeoff_explanation.weights, selected_point_ref, weights_readable |
| constraint (satisfied, slack, binding) | constraint_explanation.satisfied, slack_readable, binding_readable |
| decision frontier (points, selected_point_id) | frontier_explanation.points, selected_point_id, summary |

## Transformation Rules

1. **Determinism**: All transformations are deterministic: same ECOL input + same locale → same EEL output (excluding generated_at and explanation_id).
2. **Immutability**: EEL output is immutable once produced; regeneration creates new explanation_id.
3. **Trace binding**: Every EEL output includes trace_id and target_ref from ECOL.
4. **Ref preservation**: ECOL refs (step_id, decision_id, artifact_ref, rule_ref, etc.) are preserved in EEL; readable fields are additive (conclusion_readable, cause_readable, etc.) from cognition-to-language and graph-to-narrative.

## Contract

- Mappings are implemented by EEL pipeline; engine and ECOL are not modified.
- Missing ECOL data (e.g. no influence for target_ref) results in partial EEL output (e.g. empty contribution_breakdown); narrative still generated from available data per contracts.
