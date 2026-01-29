# Engine Robustness & Hardening Phase (ERH)

## Purpose

ERH is a **system reliability and resilience layer** for NEXUS-ENGINE. It adds failure isolation, recovery, graceful degradation, chaos engineering, self-healing, reliability patterns, disaster recovery, and runtime protection—**without changing business logic, decision semantics, or API contracts**.

All additions are **additive** (circuit breakers, bulkheads, recovery managers, fallbacks, chaos injectors, healing loops, DR, guards).

## Structure

```
engine-resilience-layer/
  src/
    types.ts
    isolation/     # Circuit breaker, bulkhead, isolation pool, blast radius
    recovery/      # Recovery manager, replay engine, state restore, auto-restart
    degradation/   # Fallback engine, degradation controller, quality governor
    chaos/         # Chaos orchestrator, fault injector, latency injector, dependency breaker
    healing/       # Anomaly detector, remediation engine, self-healing loop
    reliability/   # Retry engine, backoff engine, idempotency guard, consistency guard
    dr/            # Backup engine, snapshot engine, restore engine, failover manager
    runtime/       # Resource guard, memory guard, CPU guard, IO guard, quota controller
    harness/       # Chaos runner, resilience runner, recovery runner, failure simulator
  tests/           # Chaos, failure, recovery, isolation, degradation tests
  reports/         # Resilience, chaos, recovery, DR, reliability reports
```

## Principles

- Fail fast, fail safe, fail isolated
- Recover automatically, degrade gracefully, heal continuously
- Protect core, preserve state, maintain consistency, minimize blast radius

## Build and test

```bash
nx run engine-resilience-layer:build
nx run engine-resilience-layer:test
```

Path alias: `@nexus/engine-resilience-layer` → `engine-resilience-layer/src/index.ts`.

## Rules

- **Additive only**: No modification of core engine logic, API behavior, or decision outputs.
- **No breaking changes**: All systems wrap or extend; no behavior regression.
