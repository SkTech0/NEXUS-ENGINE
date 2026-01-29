# EOP AI Performance Report

## Purpose

Tracks inference pooling, batching, and vector caching for AI-scaled engine behavior.

## Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| inference_pool.slots | count | Pool slots |
| inference_pool.in_use | count | Slots in use |
| inference_pool.acquired | count | Acquired count |
| vector_cache.entries | count | Cached vectors |
| vector_cache.hits | count | Cache hits |
| vector_cache.misses | count | Cache misses |
| ai_batcher.buffer_length | count | Pending batch size |
| ai_batcher.batches | count | Batches flushed |
| ai_batcher.flushed | count | Requests flushed |

## Sources

- `InferencePool`, `VectorCache`, `AiBatcher`
- `runAiBench` and benchmark runner

## Before/After

Run AI benchmarks and compare inference throughput, cache hit rate, and batch utilization before and after optimization.
