# Audit Contract

## Definition

The **audit contract** defines the guarantees and format of explanations for auditor consumption. It is binding for EEL implementation when audience=auditor; engine and ECOL are unchanged.

## Guarantees

1. **Traceability**: Same as explanation-contract; plus narrative_audit MUST be present when audience=auditor. narrative_audit includes explicit references to trace_id, decision_id, step_id, rule_ref, or evidence_ref where applicable for audit trail.
2. **Causality**: For decision, rejection, review, failure explanations, cause_chain_ref or cause_summary MUST be present when cause is known. Only direct and indirect strength causes are included in narrative_audit; inferred is optional and explicitly tagged.
3. **Contribution**: contribution_breakdown MUST list all contributors with contributor_type, contributor_ref, contribution (normalized); evidence_ref when available. Sum of contribution ≤ 1 (or documented normalization).
4. **Reasoning**: reasoning_steps MUST be present for decision, outcome, rejection, approval, review; ordered by sequence; each step has step_id, conclusion or conclusion_readable, evidence_ref when available.
5. **Immutability**: Once an audit explanation is emitted, it MUST NOT be altered. Regeneration creates a new explanation_id; prior version may be retained per retention policy.
6. **Schema**: Payload conforms to explanation-schema.json with narrative_audit populated; may extend with audit-specific fields (e.g. audit_artifact_ref) per governance.

## Format

- **Payload**: JSON conforming to explanation-schema.json; narrative_audit required; narrative_audit is human-readable but includes refs for audit trail.
- **Locale**: BCP 47; default en-US.
- **Retention**: Retention of audit explanations is policy-defined (governance/explainability-policy.md); EEL does not define retention duration but MUST support immutable storage.

## Contract

- EEL implementation MUST satisfy guarantees above when producing audit explanations.
- Auditors MAY rely on narrative_audit and contribution_breakdown for audit trail; engine and ECOL are not modified.
