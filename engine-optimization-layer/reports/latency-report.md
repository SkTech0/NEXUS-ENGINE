# EOP Latency Report

## Purpose

Measures and reports latency (p50, p95, p99, max) for engine operations. Every optimization must produce before/after metrics and measurable improvement.

## Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| latency.p50 | ms | Median latency |
| latency.p95 | ms | 95th percentile |
| latency.p99 | ms | 99th percentile |
| latency.max | ms | Maximum observed |
| latency.count | count | Sample count |

## Sources

- `PipelineScheduler`, `AsyncCoordinator`, `ExecutionGraph`
- `runEngineBench`, `runLoad`, `PerfRunner`
- Compute profiler and hot-path engine

## Before/After

Run `PerfRunner.captureBefore()` before optimization and `captureAfter()` after; use `getBeforeAfter()` for improvement percentages.
