# Graph to Narrative Mapping

## Definition

This document defines how ECOL graph structures (decision graph, reasoning trace, cause chain, influence chain) are transformed into human-readable narratives for EEL explanations. All transformations are deterministic: same graph + same locale + same audience → same narrative. Engine and ECOL are unchanged.

## Input Structures

- **Decision graph**: Nodes (input, reasoning, decision_point, output); edges (depends_on, influenced_by, constrained_by). From engine-observability/cognition/decision-graph.md.
- **Reasoning trace**: Ordered steps (step_id, sequence, reasoning_type, conclusion, output_ref, confidence). From engine-observability/traces/reasoning-trace.md.
- **Cause chain**: Ordered cause-effect from root to immediate cause. From EEL cause-model (derived from ECOL causality).
- **Influence chain**: Ordered influencer → influenced. From EEL influence chain (derived from ECOL influence).
- **Contribution breakdown**: List of (contributor_type, contributor_ref, contribution). From EEL contribution-model (derived from ECOL influence).

## Narrative Generation Rules

1. **Reasoning summary**: Traverse reasoning trace steps in order; for each step, append conclusion_readable (from cognition-to-language). Join with " → " or locale equivalent. Example: "Eligibility rule E-001: eligible → Income verified → Decision: Approved."
2. **Cause summary**: Traverse cause chain from root to immediate; for each cause, append cause_readable. Join with " led to " or locale equivalent. Example: "Input income below threshold led to eligibility rule E-001: not eligible led to Decision: Denied."
3. **Contribution summary**: Sort contribution_breakdown by contribution descending; take top N (e.g. 3); for each, append contributor_name (or type) and contribution_readable. Join with "; ". Example: "Data (Applicant income) 35%; Engine (Rule E-001) 40%; AI (Risk model) 25%."
4. **Decision narrative**: Template: "[Outcome] because [reasoning_summary]. Key factors: [contribution_summary]. [Confidence/trust/risk when applicable]." Placeholders filled from EEL models; template per outcome_type and locale (contracts/explanation-contract.md).
5. **Rejection narrative**: Template: "Request was denied because [immediate_cause_readable]. [reasoning_summary]. [Trust/risk impact when applicable]." (contracts/enterprise-contract.md for narrative_customer: no internal refs.)
6. **Review narrative**: Template: "Request was referred for review because [review_reason_readable]. [reasoning_summary]. [Risk/confidence impact when applicable]."
7. **Failure narrative**: Template: "[failure_type] at [ref]. Root cause: [root_cause_readable]. [cascade_summary when applicable]. [Recovery summary when applicable]."
8. **Recovery narrative**: Template: "Recovery triggered by [trigger_readable]. Actions: [action_readable list]. Result: [final_outcome_readable]."
9. **Fallback narrative**: Template: "Fallback path used because [trigger_readable]. Primary path [primary_path_readable] was unavailable. Used [fallback_path_name]. Outcome: [outcome_status]."

## Template Structure (Conceptual)

- Templates are keyed by (narrative_type, outcome_type or target_type, audience, locale). Example: (decision, approve, human, en-US) → "Your application was approved because [reasoning_summary]. Key factors: [contribution_summary]."
- Placeholders: [reasoning_summary], [cause_summary], [contribution_summary], [immediate_cause_readable], [root_cause_readable], [confidence_explanation], [trust_impact], [risk_impact], [trigger_readable], [action_readable], [final_outcome_readable], etc. Filled from EEL model fields.
- Determinism: Same placeholders + same locale → same narrative. No random or non-deterministic content.

## Audience Variants

- **human**: Full narrative with readable summaries; no internal refs in default (or policy-defined).
- **auditor**: narrative_audit includes refs (trace_id, decision_id, step_id, rule_ref) in text or structured; see contracts/audit-contract.md.
- **regulator**: narrative_regulator structured and unambiguous; refs and evidence per contracts/regulator-contract.md.
- **customer**: narrative_customer from template with no internal refs; next steps placeholder; see contracts/enterprise-contract.md.
- **engineer**: narrative may include technical refs and codes; see contracts/explanation-contract.md.

## Contract

- Graph-to-narrative is implemented by EEL (templates + placeholder substitution); engine and ECOL are not modified.
- All narratives are deterministic and locale-aware; PII and safety per governance/explainability-policy.md.
