# Explainability Standards

## Definition

The **explainability standards** define technical and quality standards for EEL: schema compliance, deterministic rules, interpretation thresholds, completeness, and consistency. They are binding for EEL implementation; engine and ECOL are unchanged.

## Schema Compliance

- All explanation payloads MUST conform to schemas/explanation-schema.json and type-specific schemas (decision-schema, reasoning-schema, confidence-schema, risk-schema, trust-schema). Validation MUST be performed before emission; invalid payloads MUST NOT be emitted.
- Schema version is declared in payload ($schema or version); breaking changes require new schema version and API version (contracts/api-explainability-contract.md).

## Determinism

- For the same ECOL input (trace_id, target_ref, and all ECOL data for that trace/target) and same locale and audience, the explanation structure (excluding explanation_id and generated_at) MUST be identical. Narrative text MUST be produced by deterministic templates and cognition-to-language mapping; no random or non-deterministic content.
- Regeneration (e.g. after catalog update) may change narrative; same catalog and templates + same ECOL input → same output.

## Interpretation Thresholds

- **Confidence**: Low [0, 0.5), Medium [0.5, 0.8), High [0.8, 1]. Used for confidence_interpretation and narrative. Thresholds are configurable; default as stated.
- **Uncertainty**: Low [0, 0.2), Medium [0.2, 0.5), High [0.5, 1]. Used for uncertainty_interpretation. Configurable.
- **Risk tier**: low, medium, high (and optional critical) from risk_score or risk_tier; mapping is policy-defined. Used for risk_interpretation and narrative.
- **Trust**: Threshold for "trust gate" (e.g. 0.5) is policy-defined; used for trust_interpretation and effect_readable.

## Completeness

- **Decision / outcome / approval**: reasoning_summary or reasoning_steps, contribution_summary or contribution_breakdown, narrative MUST be present. confidence and trust_impact when applicable.
- **Rejection / review**: cause_summary or immediate_cause_readable, reasoning_summary, narrative MUST be present. trust_impact, risk_impact when applicable.
- **Failure**: root_cause_readable or cause_summary, narrative MUST be present. cascade_summary when cascade exists; recovery_summary when recovery occurred.
- **Recovery**: trigger_readable, actions (with action_readable), final_outcome_readable, narrative MUST be present.
- **Fallback**: trigger_readable, primary_path_readable, fallback_path_name, outcome_status, narrative MUST be present.
- Missing ECOL data: Partial explanation is allowed; omit missing sections; narrative still generated from available data (contracts/explanation-contract.md).

## Consistency

- Contributor types (data, engine, ai, trust, optimization) MUST match ECOL influence types; no ad-hoc types.
- Outcome types (approve, deny, refer, defer, custom) MUST match ECOL decision flow outcome_type.
- Ref preservation: step_id, decision_id, artifact_ref, rule_ref, model_id, etc. MUST be preserved from ECOL in EEL payload; readable fields are additive.

## Contract

- EEL implementation MUST satisfy explainability standards; engine and ECOL are not modified.
- Non-compliance (e.g. non-deterministic narrative, missing required field) is a defect and MUST be remediated in EEL implementation.
