# Fail-Safe Modes

## Purpose

Define fail-safe modes for NEXUS-ENGINE: behavior when the engine fails, degrades, or is overridden. Additive; no change to engine behavior.

## Principles

- Fail-safe design: on failure or boundary violation, engine degrades to a safe, predictable state.
- Safe state is defined per deployment: e.g., deny, fallback to default, or hand off to human.
- No silent failure: failures are logged and observable (see audit, observability).

## Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| Normal | No failure | Engine operates within boundaries and policy. |
| Degraded | Partial failure, overload, or policy | Reduced capability or fallback path; audit and alert. |
| Override | Human or policy override | Engine output replaced or ignored; override logged. |
| Fail-closed | Critical failure or safety trigger | Engine refuses to decide or returns safe default; incident logged. |

## Engine Support

- Resilience layer supports circuit breakers, bulkheads, and fallback (see engine-resilience-layer).
- Degradation and fallback engine support tiered response (see engine-resilience-layer degradation).
- Override and fallback are integration responsibilities; engine supports audit events for override.
- Validation and consistency checks support fail-closed when invariants are violated (see engine-validation).

## Certification Readiness

- Fail-safe modes documented; implementation is deployment-specific.
- No engine logic or API changes required; design supports safe degradation.
