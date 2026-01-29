# Explainability Quality

## Definition

The **explainability quality** document defines quality criteria and measures for EEL explanations: accuracy, consistency, completeness, readability, and auditability. It is binding for EEL implementation and quality assurance; engine and ECOL are unchanged.

## Quality Criteria

1. **Accuracy**: Explanation content MUST accurately reflect ECOL data. reasoning_steps MUST match ECOL reasoning trace order and conclusions; contribution_breakdown MUST reflect ECOL influence records (normalized); cause_chain MUST reflect ECOL causality. No fabrication or hallucination; EEL only transforms and summarizes ECOL data.
2. **Consistency**: Same ECOL input + same locale + same audience → same explanation (determinism). Cross-explanation consistency: contribution_breakdown for decision_id MUST match contribution_breakdown for outcome_ref when outcome is produced by that decision. Ref consistency: all refs (step_id, decision_id, artifact_ref) in explanation MUST exist in ECOL trace.
3. **Completeness**: Per explainability-standards (completeness section); required fields present for each explanation type. When ECOL data is partial, explanation is partial but narrative MUST not claim completeness where data is missing (e.g. no "all factors" when contribution_breakdown is incomplete).
4. **Readability**: Narrative MUST be grammatical and coherent in the specified locale. Template placeholders MUST be filled; no empty or null placeholder in final narrative. Length appropriate to audience (e.g. narrative_short for customer when policy requires brevity).
5. **Auditability**: narrative_audit and narrative_regulator MUST include refs (trace_id, decision_id, step_id, evidence_ref) where required by contracts/audit-contract.md and regulator-contract.md. Contribution and cause chain MUST be traceable to ECOL records.

## Quality Measures (Conceptual)

- **Accuracy**: Spot-check explanation content against ECOL trace; contribution sum vs ECOL influence; cause chain vs ECOL causality. Target: 100% match.
- **Determinism**: Regenerate explanation for same input; compare structure and narrative. Target: identical (excluding explanation_id, generated_at).
- **Completeness**: Check required fields per explanation type. Target: 100% for required fields when ECOL data exists.
- **Schema compliance**: Validate all emitted payloads against JSON schema. Target: 100% valid.
- **Ref validity**: All refs in explanation resolve to ECOL entities. Target: 100% resolvable.

## Contract

- EEL implementation MUST target quality criteria above; engine and ECOL are not modified.
- Quality assurance (testing, monitoring) is implementation concern; this document defines the criteria.
