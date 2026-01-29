# Harm Prevention

## Purpose

Document harm prevention for NEXUS-ENGINE: design and controls to reduce risk of physical, financial, or reputational harm. Additive; no change to engine behavior.

## Principles

- Harm prevention by design: engine does not directly control physical systems; decisions are advisory or feed into controlled systems.
- Outputs are bounded and interpretable (see engine-explainability).
- Fallback and override available when harm risk is elevated (see safety-fallback, fail-safe-modes).

## Scope

- Engine is a decision-support and intelligence component; it does not actuate physical or financial systems directly.
- Harm prevention is achieved through: bounded outputs, validation, audit, human oversight, and integration-layer controls.
- Safety-critical actuation is responsibility of integrating system; engine provides traceable, explainable decisions.

## Controls

| Control | Engine Support |
|---------|----------------|
| Output bounds | Configurable limits; validation and post-processing at boundary. |
| Explainability | Decision rationale and lineage (see engine-explainability, audit). |
| Override | Human override and fallback modes (see safety-fallback). |
| Audit | Every decision logged with context (see audit). |
| Validation | Determinism and consistency checks (see engine-validation). |

## Certification Readiness

- Harm prevention posture documented; implementation is deployment and use-case specific.
- No engine logic or API changes required.
