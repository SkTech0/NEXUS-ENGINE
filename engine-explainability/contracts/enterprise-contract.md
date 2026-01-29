# Enterprise Contract

## Definition

The **enterprise contract** defines the guarantees and format of explanations for enterprise and customer consumption. It is binding for EEL implementation when audience=enterprise or audience=customer; engine and ECOL are unchanged.

## Guarantees

1. **Traceability**: explanation_id, trace_id, target_ref, generated_at present; customer-facing narrative (narrative_customer when present) MUST NOT contain internal refs (rule_id, constraint_id, step_id) unless enterprise policy permits. Default: narrative_customer uses only human-readable labels (e.g. "Eligibility criteria", "Income verification") per governance/explainability-policy.md.
2. **Readability**: narrative (and narrative_customer) MUST be human-readable in the specified locale; no jargon or internal codes unless policy permits. Length and detail level may be constrained (e.g. narrative_short for customer).
3. **Safety**: No PII in narrative_customer unless explicitly permitted; no internal implementation details (e.g. fallback path id, timeout duration) in customer narrative unless policy permits (governance/explainability-policy.md).
4. **Consistency**: Same outcome + same locale + audience=enterprise or customer → same narrative (deterministic template).
5. **Contribution**: For enterprise, contribution_summary or contribution_breakdown may be included with contributor_name (readable labels); for customer, only contribution_summary or high-level summary (e.g. "Based on your application details and our policy") per policy.
6. **Rejection and review**: For rejection and review, narrative_customer MUST be non-technical and, where required by policy, include next steps or contact information placeholder (content from product, not EEL).

## Format

- **Payload**: JSON conforming to explanation-schema.json; narrative required; narrative_customer when target is customer-facing (rejection, approval, review).
- **Locale**: BCP 47; default en-US.
- **API**: Enterprise and customer APIs MAY rate-limit or cache explanations; EEL does not define API policy but MUST support idempotent generation per explanation-contract.

## Contract

- EEL implementation MUST satisfy guarantees above when producing enterprise or customer explanations.
- Enterprise and customer applications MAY rely on narrative and narrative_customer for display; engine and ECOL are not modified.
- PII and safety rules are enforced by EEL (governance/explainability-policy.md); EEL does not store PII in narrative unless policy permits.
