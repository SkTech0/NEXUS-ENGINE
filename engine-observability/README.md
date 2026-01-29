# Engine Cognitive Observability Layer (ECOL)

## Purpose

ECOL is a platform layer that provides **cognitive observability** for the NEXUS-ENGINE: visibility into how the engine reasons, decides, propagates influence, and recovers—without altering business logic, decision logic, or API contracts.

## Scope

| In scope | Out of scope |
|----------|--------------|
| Reasoning trace | Infrastructure monitoring |
| Decision causality | Application logging |
| Influence propagation | Metrics dashboards |
| Trust/confidence flow | Product UI |
| AI contribution visibility | Product analytics |
| Failure cascade analysis | |
| Recovery behavior | |
| Replay and audit | |

## Layer Structure

```
engine-observability/
  cognition/           # Decision graphs, reasoning, inference
  causality/           # Causality, correlation, propagation
  influence/           # Engine, data, AI, trust, optimization influence
  flows/               # Data, decision, confidence, trust, risk flows
  traces/              # Reasoning, decision, execution, recovery, failure
  states/              # Cognitive, decision, engine state; transitions
  failures/            # Failure, cascade, degradation, fallback models
  recovery/            # Recovery, self-healing, stabilization, compensation
  replay/              # Replay, determinism, timeline, audit
  trust-confidence/    # Trust, confidence, uncertainty, explainability
  optimization/       # Paths, constraints, tradeoffs, frontier
  ai-observability/    # AI contribution, model influence, explainability
  visualization-models/# Graph, timeline, propagation, influence, tree
  integration/         # OTEL, trace, log, metric mapping
  instrumentation/    # Declarative hook design (additive only)
```

## Design Principles

1. **Additive only** — No modification of existing engine behavior.
2. **Backward-compatible** — All extensions are optional and non-breaking.
3. **Declarative instrumentation** — Hooks define where and how to attach; no runtime logic changes.
4. **Model-first** — Documents define models, schemas, structures, and contracts.
5. **Platform-grade** — Suitable for enterprise and regulatory use.

## Outcomes

- **Explainable** — Reasoning paths and decisions can be explained.
- **Auditable** — Decision graphs and timelines can be reconstructed and audited.
- **Inspectable** — Cognitive state and influence can be inspected.
- **Traceable** — Reasoning, decision, and execution traces are defined.
- **Certifiable** — Models support compliance and certification.
- **Governable** — Trust, risk, and AI contribution are observable.
- **Debuggable** — Failure cascades and recovery are analyzable.

## Usage

This layer is **design and contract**. Implementation attaches via the instrumentation hooks described in `instrumentation/` and emits structures defined in the subdirectories. Integration with OpenTelemetry and existing observability is described in `integration/`.
