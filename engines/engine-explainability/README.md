# Engine Explainability Layer (EEL)

## Purpose

EEL is a platform layer that provides **explainability** for the NEXUS-ENGINE: translation of engine cognition into human-understandable, auditor-readable, regulator-readable, and enterprise-readable explanations—without altering business logic, decision logic, or API contracts.

## Scope

| In scope | Out of scope |
|----------|--------------|
| Human-readable explanations | Logging |
| Reasoning interpretability | Observability (ECOL) |
| Outcome explainability | Monitoring |
| Trust/confidence/risk transparency | Product UI |
| AI influence visibility | Analytics |
| Optimization/tradeoff clarity | |
| Failure/recovery explanation | |
| Audit/regulator/enterprise contracts | |

## Explanation Pipeline

```
engine cognition
  → observability traces (ECOL)
  → causal models
  → influence models
  → reasoning models
  → explanation models (EEL)
  → human-readable explanations
  → audit-grade explanations
  → regulator-grade explanations
  → enterprise-grade explanations
```

**Stages**:
1. **Engine cognition**: Runtime reasoning, decisions, inference, constraints (unchanged).
2. **ECOL traces**: Reasoning trace, decision trace, decision graph, influence, causality (engine-observability).
3. **Causal models**: Cause-effect, dependency, propagation (from ECOL causality).
4. **Influence models**: Engine, data, AI, trust, optimization contribution (from ECOL influence).
5. **Reasoning models**: Step sequence, conclusion chain (from ECOL reasoning).
6. **Explanation models (EEL)**: Structured explanation schema, cause model, contribution model (this layer).
7. **Human-readable**: Narrative/template-based text (mappings/cognition-to-language, graph-to-narrative).
8. **Audit/regulator/enterprise**: Contracts and formats (contracts/*).

## Layer Structure

```
engine-explainability/
  models/              # Explanation, reasoning, cause, contribution, confidence, risk, trust, tradeoff, uncertainty
  explanations/        # Decision, outcome, rejection, approval, review, fallback, recovery, failure
  ai-explainability/   # AI reasoning, contribution, confidence, uncertainty, influence, model explainability
  optimization-explainability/  # Optimization reasoning, constraint, tradeoff, path, frontier
  trust-explainability/         # Trust decision, confidence, risk, validation, failure
  causality-explainability/     # Cause-effect, influence chain, dependency chain, propagation chain
  schemas/             # JSON schemas (explanation, reasoning, decision, confidence, risk, trust)
  contracts/           # Explanation, audit, regulator, enterprise, API contracts
  mappings/            # ECOL→EEL, trace→explanation, cognition→language, graph→narrative
  governance/           # Policy, standards, quality, certification
```

## Design Principles

1. **Additive only**: EEL consumes ECOL and produces explanations; no modification of engine logic.
2. **Deterministic**: Same inputs (trace, graph) produce same explanation structure; narrative may vary by template/locale.
3. **Traceable**: Every explanation references trace_id, decision_id, or artifact_ref for audit.
4. **Structured**: Machine-readable schemas (JSON); human-readable via mappings and templates.
5. **Contract-driven**: Audit, regulator, enterprise, and API contracts define formats and guarantees.

## Outcomes

- **Explainable**: Decisions and outcomes have structured explanations.
- **Interpretable**: Reasoning path and contribution breakdown are interpretable.
- **Auditable**: Audit-grade and regulator-grade formats and contracts.
- **Enterprise-trustworthy**: Enterprise and client-facing explanation contracts.
- **Certifiable**: Governance (policy, standards, quality, certification) defined.
- **Transparent**: Trust, confidence, risk, tradeoffs, failures, recovery are explainable.
