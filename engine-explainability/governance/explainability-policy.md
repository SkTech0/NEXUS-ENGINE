# Explainability Policy

## Definition

The **explainability policy** defines organizational and technical policies for EEL: what must be explained, what must not be disclosed, PII handling, audience-specific rules, and retention. It is binding for EEL implementation; engine and ECOL are unchanged.

## Scope

1. **What must be explained**: Every decision, outcome, rejection, approval, review, fallback, recovery, and failure that is observable via ECOL MUST be explainable via EEL when requested (trace_id, target_ref). Exceptions: policy-defined exclusions (e.g. internal-only traces); document exclusions.
2. **What must not be disclosed**: Internal refs (rule_id, constraint_id, step_id, model internal names) MUST NOT appear in customer-facing narrative (narrative_customer) unless explicitly permitted. Implementation details (timeout duration, fallback path id, retry count) MUST NOT appear in customer narrative unless permitted. Failure messages MUST NOT expose stack traces or internal codes to customer unless permitted.
3. **PII**: Narrative and contributor_name MUST NOT contain PII (e.g. applicant name, income value, address) unless explicitly permitted by policy. Use labels ("Applicant income", "Income verification") not values. EEL may store refs (artifact_ref) that point to data; narrative generation MUST not inject PII from data into text unless policy permits.
4. **Audience-specific**: Customer: no internal refs; enterprise: refs optional per contract; auditor: refs required; regulator: refs and evidence per regulator-contract. Engineer: technical refs and codes permitted.
5. **Retention**: Explanation retention is policy-defined (e.g. 7 years for audit, 90 days for customer). EEL implementation MUST support immutable storage and retention period; actual duration is configuration or legal requirement.
6. **Fallback and failure disclosure**: Whether to disclose "fallback used" or "timeout" to customer is policy-defined. Default: narrative_customer uses neutral phrasing ("Result based on available data") unless policy requires transparency.
7. **AI disclosure**: Whether to disclose "AI contributed" or "model X contributed" to customer is policy-defined. Regulator and auditor typically require AI contribution visibility; customer may be generic ("Our assessment") unless policy permits.

## Policy Enforcement

- EEL narrative generation (mappings/graph-to-narrative.md, cognition-to-language.md) MUST apply policy: no PII, no internal refs in customer narrative, unless policy permits.
- Catalog and templates (cognition-to-language) MUST NOT expose internal refs in customer locale/audience when policy forbids.
- Contracts (enterprise-contract, audit-contract, regulator-contract) align with this policy; conflicts resolved by policy override.

## Contract

- EEL implementation MUST enforce explainability policy; engine and ECOL are not modified.
- Policy changes (e.g. permit PII in enterprise narrative) are configuration or governance updates; EEL code may support toggles per audience/locale.
