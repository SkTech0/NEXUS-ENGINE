# Dependency Chain Explainability

## Definition

**Dependency chain explainability** is the representation of a chain of dependencies (B depended on A, C depended on B) in a form suitable for human interpretation: ordered list of dependents and dependencies, with readable descriptions and narrative. It is derived from ECOL dependency-influence—without altering engine behavior.

## Schema

```yaml
dependency_chain_explanation_id: string
trace_id: string
target_ref: string  # final dependent ref (decision_id or output_ref)
generated_at: ISO8601
locale: string

# Chain (ordered from root dependency to final dependent)
chain: list of:
  sequence: integer
  depends_on_ref: string  # A
  dependent_ref: string   # B (depended on A)
  dependency_type: enum [data | control | temporal | resource]
  dependency_type_readable: string  # e.g. "Data dependency"
  strength: enum [hard | soft]
  strength_readable: string  # e.g. "Hard dependency"
  evidence_ref: string | null
  step_readable: string  # e.g. "Decision required eligibility result"

# Summary
chain_length: integer
root_ref: string  # first depends_on_ref in chain
root_readable: string | null
summary: string  # human-readable summary of dependency chain
```

## Deterministic Rules

1. **Chain order**: chain is ordered from root (earliest/furthest dependency) to target_ref (final dependent); order from ECOL dependency graph (topological).
2. **Dependency type readable**: dependency_type_readable = f(dependency_type, locale); deterministic.
3. **Strength readable**: strength_readable = f(strength, locale); deterministic.
4. **Step readable**: step_readable = f(dependency_type, depends_on_ref, dependent_ref, locale); template-based, deterministic (cognition-to-language).
5. **Root readable**: root_readable = f(root_ref, locale); from catalog or ref; deterministic.
6. **Summary**: summary = f(chain_length, chain (with step_readable), root_readable, locale); template-based, deterministic.

## Transformation (ECOL → EEL)

- **Input**: ECOL dependency edges (causality/dependency-influence.md); traverse backward from target_ref (dependent_ref) to build chain (depends_on_ref → dependent_ref).
- **Output**: dependency_chain_explanation with chain (enriched with readable), root_ref, summary.
- **Rules**: See mappings/ecol-to-eel-mapping.md; chain built by following dependent_ref backward to depends_on_ref.

## Contract

- Dependency chain explanation is read-only over ECOL dependency; no change to engine logic.
- dependency_chain_explanation_id is immutable; target_ref and trace_id are required for audit.
