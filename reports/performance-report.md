# Performance Report

*Auto-generated from benchmarks and load tests.*

## Benchmarks

- `benchmarks/engine-benchmark.py`
- `benchmarks/ai-benchmark.py`
- `benchmarks/api-benchmark.py` (requires engine-api)
- `benchmarks/distributed-benchmark.py`

## Load Tests

- `scripts/load-test.sh` — k6 or curl loop
- `scripts/load-test-k6.js`

## Gates

- API p95 < 2s
- Inference < 5s, Optimization < 3s (see `quality/performance-rules.yml`)
