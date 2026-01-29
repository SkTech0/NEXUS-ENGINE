# EOP Network Report

## Purpose

Tracks connection pooling, transport reuse, and compression for network-efficient engine behavior.

## Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| connection_pool.size | count | Pool size |
| connection_pool.in_use | count | Connections in use |
| connection_pool.acquired | count | Total acquired |
| transport.count | count | Transport count |
| transport.requests | count | Request count |
| transport.reused | count | Reuse count |
| compression.compressed_bytes | bytes | Compressed payload size |
| compression.compress_count | count | Compress operations |

## Sources

- `ConnectionPool`, `TransportManager`, `CompressionEngine`

## Before/After

Compare pool utilization and transport reuse before and after optimization to prove connection and transport efficiency.
