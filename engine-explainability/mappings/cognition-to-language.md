# Cognition to Language Mapping

## Definition

This document defines how engine cognition concepts (refs, types, codes) are translated into human-readable language for explanations. All mappings are deterministic: same input + same locale → same output. Engine and ECOL are unchanged.

## Mapping Scope

- **Inputs**: ECOL refs (step_id, decision_id, rule_ref, constraint_ref, model_id, artifact_ref, failure_type, etc.), types (reasoning_type, decision_type, outcome_type, etc.), codes (rejection_code, failure code), values (confidence, contribution, risk_tier).
- **Outputs**: Human-readable strings (conclusion_readable, cause_readable, contributor_name, effect_readable, etc.) used in EEL narratives and summaries.

## Deterministic Rules

1. **Ref to name**: Internal refs (rule_id, constraint_id, model_id) map to human-readable names via a catalog or template. Catalog is keyed by (ref_type, ref_id, locale); value is readable name. Example: rule_id "E-001" → "Eligibility rule: Income threshold". When catalog has no entry, fallback = ref_id or "Rule E-001" (ref_id with prefix).
2. **Type to readable**: Enum types map to locale strings. Example: reasoning_type "rule_based" → "Rule evaluation"; decision_type "binary" → "Binary decision"; outcome_type "approve" → "Approved". Table per type and locale (or template with placeholder).
3. **Value to interpretation**: Numeric values map to interpretation via thresholds (governance/explainability-standards.md). Example: confidence 0.85 → "High confidence" when threshold [0.8,1] = High. Deterministic per threshold policy.
4. **Code to readable**: rejection_code, failure code map to short readable message. Example: code "TRUST_BELOW" → "Trust below threshold". Catalog or template per code and locale.

## Catalog Structure (Conceptual)

```yaml
# Conceptual; implementation may be DB or config
catalog:
  rules:
    "E-001": { en-US: "Eligibility rule: Income threshold", ... }
  constraints:
    "C-MAX-LTV": { en-US: "Maximum LTV ratio", ... }
  models:
    "credit-risk-v2": { en-US: "Credit risk classifier v2.1", ... }
  outcome_types:
    approve: { en-US: "Approved", ... }
    deny: { en-US: "Denied", ... }
    refer: { en-US: "Referred for review", ... }
  reasoning_types:
    rule_based: { en-US: "Rule evaluation", ... }
    inference: { en-US: "Model inference", ... }
  failure_types:
    timeout: { en-US: "Timeout", ... }
    error: { en-US: "Error", ... }
```

## Transformation Examples

- **conclusion_readable**: conclusion = "eligible"; reasoning_type = "rule_based"; evidence_ref = "E-001" → "Eligibility rule E-001: eligible" (or from catalog "Eligibility rule: Income threshold: eligible").
- **cause_readable**: cause_type = "reasoning_step"; cause_ref = "step_123"; evidence_ref = "E-001" → "Eligibility rule E-001 determined outcome" (catalog for E-001).
- **contributor_name**: contributor_type = "data"; contributor_ref = "payload.income" → "Applicant income" (catalog or field path to label).
- **effect_readable**: effect = "gate"; effect_outcome = "allowed"; trust_score = 0.72 → "Trust gate passed (0.72); request allowed".

## Locale

- All outputs are locale-specific; default locale en-US. Missing locale falls back to default. Catalog and templates support multiple locales; same ref/type/code + locale → same string.

## Contract

- Cognition-to-language is implemented by EEL (catalog + templates); engine and ECOL are not modified.
- No PII in output: contributor_name and narrative strings must not contain PII unless policy permits (governance/explainability-policy.md). Use "Applicant income" not actual value.
