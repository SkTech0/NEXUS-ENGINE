# ERH Chaos Report

## Purpose

Documents chaos engineering components and metrics. Use in test/harness only; do not enable in production by default.

## Components

| Component | Role | Config |
|-----------|------|--------|
| ChaosOrchestrator | Coordinates fault type (none, latency, failure, packet_loss, dependency) | enabled, maxLatencyMs, failureRate |
| FaultInjector | Injects throw/timeout/slow | enabled, faultRate, faultType, timeoutMs |
| LatencyInjector | Injects delay | enabled, minMs, maxMs, injectRate |
| DependencyBreaker | Simulates dependency failure | enabled, breakRate, breakDurationMs |

## Metrics

- chaos_orchestrator.injections, latency_injected, failures_injected
- fault_injector.injected, skipped
- latency_injector.injected, total_ms
- dependency_breaker.broken_count, breaks, recoveries

## Harness

- `runChaosScenario(config, op)` — runs op under chaos for durationMs; returns metrics and component refs.
- `FailureSimulator` — wrap(dependencyId, fn) applies fault + latency and checks dependency break.

## Safety

Chaos systems are additive and do not change engine semantics. Enable only in test or controlled chaos experiments.
