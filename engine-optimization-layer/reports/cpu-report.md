# EOP CPU Report

## Purpose

Tracks CPU and compute usage via profiler, hot-path engine, and complexity analyzer. Ensures CPU-efficient engine behavior.

## Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| profiler.samples | count | Profiler sample count |
| profiler.counter.* | count | Named counters |
| hotpath.records | count | Path records |
| hotpath.hot_count | count | Hot path count |
| complexity.records | count | Complexity records |
| complexity.avg_ms | ms | Average op time |

## Sources

- `ComputeProfiler`, `HotPathEngine`, `ComplexityAnalyzer`
- Pipeline and execution graph metrics

## Before/After

Run profiler and hot-path engine during baseline and optimized runs; compare sample counts and hot-path distribution.
