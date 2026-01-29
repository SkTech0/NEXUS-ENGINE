# Regulator Contract

## Definition

The **regulator contract** defines the guarantees and format of explanations for regulator consumption. It is binding for EEL implementation when audience=regulator; engine and ECOL are unchanged.

## Guarantees

1. **Traceability**: Same as audit-contract; narrative_regulator MUST be present when audience=regulator. narrative_regulator is suitable for regulatory submission: structured, unambiguous, with refs to trace_id, decision_id, and evidence where required by regulation.
2. **Causality**: Cause chain (root cause to immediate cause) MUST be present for rejection, review, failure explanations when cause is known. Strength limited to direct and indirect; inferred excluded from narrative_regulator unless explicitly permitted by regulation.
3. **Contribution**: contribution_breakdown MUST be present for decision, outcome; contributor_type and contribution (normalized) required; AI contribution MUST be explicitly tagged (contributor_type=ai) with model_ref or inference_ref when applicable for AI/ML regulation.
4. **Confidence and uncertainty**: When confidence or uncertainty is used in the decision, confidence_explanation and uncertainty_explanation MUST be present in regulator narrative or in structured fields; interpretation thresholds documented (governance/explainability-standards.md).
5. **Risk**: When risk affected the decision, risk_explanation and effect MUST be present; risk_tier and risk_type when available.
6. **Trust**: When trust affected the decision (gate, threshold), trust_explanation and effect MUST be present.
7. **Immutability**: Same as audit-contract; regulator explanations are immutable once emitted.
8. **Compliance**: Format and content MUST align with applicable regulatory requirements (e.g. fair lending, GDPR explainability, model risk); governance/explainability-certification.md may reference specific regulations.

## Format

- **Payload**: JSON conforming to explanation-schema.json; narrative_regulator required; all regulator-required fields populated per guarantees above.
- **Locale**: BCP 47; default en-US; regulators may require specific locale.
- **Certification**: governance/explainability-certification.md defines certification process for regulator readiness.

## Contract

- EEL implementation MUST satisfy guarantees above when producing regulator explanations.
- Regulators MAY rely on narrative_regulator and structured fields for compliance; engine and ECOL are not modified.
