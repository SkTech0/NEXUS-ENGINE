# Safety Fallback

## Purpose

Define safety fallback for NEXUS-ENGINE: fallback strategies when primary path is unsafe or unavailable. Additive; no change to engine behavior.

## Principles

- Safety fallback by design: when primary inference or decision path is unavailable or rejected by policy, a defined fallback is used.
- Fallback is explicit: e.g., default decision, human review, or another model; no undefined behavior.
- Fallback is audited: every fallback event is logged with reason and context (see audit).

## Fallback Types

| Type | Description | Engine Support |
|------|-------------|----------------|
| Model fallback | Use alternative model when primary fails or is unavailable | Configuration; engine supports model ref and override. |
| Human fallback | Route to human when confidence low or policy requires | Integration; engine supports confidence and override events. |
| Default fallback | Return safe default (e.g., deny or neutral) when unable to decide | Configuration and integration. |
| Tier fallback | Degrade to reduced capability (see resilience degradation) | Resilience layer. |

## Engine Support

- Fallback engine and degradation controller in resilience layer (see engine-resilience-layer).
- Explainability layer supports confidence and rationale for human fallback (see engine-explainability).
- Audit records every fallback with reason, model, and context (see audit).

## Certification Readiness

- Safety fallback documented; configuration is deployment-specific.
- No engine logic or API changes required.
