# EOP Throughput Report

## Purpose

Measures and reports throughput (ops/s) for engine, pipeline, AI, and IO. Every optimization must produce before/after metrics.

## Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| throughput.ops_per_second | ops/s | Operations per second |
| throughput.window_ms | ms | Measurement window |
| throughput.timestamp | ms | Sample timestamp |

## Sources

- `runEngineBench`, `runPipelineBench`, `runAiBench`, `runIoBench`
- `runLoad`, `runStress`, `BenchmarkRunner`
- Scheduler and stream engine metrics

## Before/After

Use harness `runAllBenchmarks()` and compare `engine.throughput`, `pipeline.throughput`, `ai.throughput`, `io.throughput` before and after optimization.
