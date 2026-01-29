# EOP Memory Report

## Purpose

Tracks memory usage and allocation for buffer pools, caches, and managed allocations. Ensures memory-efficient engine behavior.

## Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| memory.tracked_bytes | bytes | Tracked allocation total |
| memory.allocations | count | Allocation count |
| memory.releases | count | Release count |
| buffer_pool.size | count | Pool available buffers |
| buffer_pool.checked_out | count | Buffers in use |
| engine_cache.entries | count | Cache entry count |
| state_cache.entries | count | State cache entries |

## Sources

- `MemoryManager`, `BufferPool`
- `EngineCache`, `StateCache`, `SnapshotCache`
- `SerializationEngine` (encode cache)

## Before/After

Use `MemoryManager.getMetrics()` and cache `getMetrics()` before and after optimization to prove no regression or improved reuse.
