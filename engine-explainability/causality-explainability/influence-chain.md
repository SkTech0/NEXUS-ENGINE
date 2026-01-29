# Influence Chain Explainability

## Definition

**Influence chain explainability** is the representation of a chain of influence (A influenced B influenced C) in a form suitable for human interpretation: ordered list of influencers and influenced, with readable descriptions and narrative. It is derived from ECOL influence records and propagation—without altering engine behavior.

## Schema

```yaml
influence_chain_explanation_id: string
trace_id: string
target_ref: string  # final influenced ref (decision_id or output_ref)
generated_at: ISO8601
locale: string

# Chain (ordered from first influencer to final influenced)
chain: list of:
  sequence: integer
  influencer_ref: string
  influencer_type: enum [data | engine | ai | trust | optimization]
  influencer_type_readable: string  # e.g. "Data"
  influenced_ref: string
  influenced_type_readable: string  # e.g. "Reasoning step"
  contribution: float | null  # [0,1]
  contribution_readable: string | null  # e.g. "35%"
  step_readable: string  # e.g. "Applicant income influenced eligibility check"

# Summary
chain_length: integer
summary: string  # human-readable summary of influence chain
primary_influencer_type: string  # influencer_type with max cumulative contribution (or first)
primary_influencer_readable: string | null
```

## Deterministic Rules

1. **Chain order**: chain is ordered from first influencer (upstream) to final influenced (target_ref); order from ECOL influence graph (topological or by timestamp).
2. **Influencer type readable**: influencer_type_readable = f(influencer_type, locale); deterministic.
3. **Step readable**: step_readable = f(influencer_type, influencer_ref, influenced_ref, contribution, locale); template-based, deterministic (cognition-to-language).
4. **Primary influencer**: primary_influencer_type = argmax cumulative contribution or first in chain; primary_influencer_readable = f(primary_influencer_type, chain[0].influencer_ref, locale); deterministic.
5. **Summary**: summary = f(chain_length, chain (with step_readable), primary_influencer_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL influence records (influence/*) for target_ref; traverse backward from target_ref to build chain (influencer → influenced).
- **Output**: influence_chain_explanation with chain (enriched with readable), summary.
- **Rules**: See mappings/graph-to-narrative.md; chain built by following influenced_ref backward to influencer_ref; aggregation when multiple influencers per node.

## Contract

- Influence chain explanation is read-only over ECOL influence; no change to engine logic.
- influence_chain_explanation_id is immutable; target_ref and trace_id are required for audit.
