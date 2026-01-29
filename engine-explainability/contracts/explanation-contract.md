# Explanation Contract

## Definition

The **explanation contract** defines the guarantees and format of explanations produced by EEL for general (human, engineer) consumption. It is binding for EEL implementation; engine and ECOL are unchanged.

## Guarantees

1. **Traceability**: Every explanation includes `explanation_id`, `trace_id`, `target_ref`, and `generated_at`. These are immutable and sufficient to correlate with ECOL trace and entity.
2. **Determinism**: For the same ECOL input (trace, graph, influence) and same locale/audience, the explanation structure (excluding generated_at and explanation_id) is deterministic. Narrative text is produced by deterministic templates.
3. **Completeness**: For target_type decision, outcome, rejection, approval, review, the explanation includes at least: reasoning_summary or reasoning_steps, contribution_summary or contribution_breakdown, narrative. For fallback, recovery, failure: cause and narrative.
4. **No PII in default narrative**: Default narrative (audience=human) must not contain PII unless explicitly permitted by policy; contributor_ref and evidence_ref may be internal ids; contributor_name and narrative use policy-safe labels (governance/explainability-policy.md).
5. **Schema compliance**: Explanation payload MUST conform to schemas/explanation-schema.json (and type-specific schemas where applicable). Validation is required before emission.

## Format

- **Payload**: JSON conforming to explanation-schema.json.
- **Encoding**: UTF-8.
- **Locale**: BCP 47 (e.g. en-US). Default: en-US.
- **Audience**: One of human, auditor, regulator, enterprise, customer, investor, engineer. Determines which narrative variant and detail level are included (see contracts/audit-contract.md, regulator-contract.md, enterprise-contract.md).

## API (Conceptual)

- **Request**: GET or POST with trace_id, target_ref, target_type, locale, audience.
- **Response**: Explanation payload (JSON); 404 if no explanation available for target_ref/trace_id.
- **Idempotency**: Same request (trace_id, target_ref, locale, audience) returns same explanation structure; explanation_id may be stable or regenerated per policy.

## Contract

- EEL implementation MUST satisfy guarantees above; engine and ECOL are not modified.
- Violations (e.g. missing trace_id, non-deterministic narrative for same input) are contract violations and must be remediated in EEL implementation only.
