# ERH Reliability Report

## Purpose

Documents reliability patterns: retry, backoff, idempotency, consistency. Additive; no change to engine semantics.

## Components

| Component | Role | Config |
|-----------|------|--------|
| RetryEngine | Retry with configurable attempts and backoff | maxAttempts, initialDelayMs, maxDelayMs, multiplier, retryableErrors |
| BackoffEngine | Backoff strategies (linear, exponential, jitter) | strategy, baseMs, maxMs, jitterFactor |
| IdempotencyGuard | Duplicate request detection | maxKeys, ttlMs |
| ConsistencyGuard | Consistency check recording | maxChecksPerWindow, windowMs |

## Metrics

- retry_engine.attempts, successes, failures, retries
- backoff_engine.attempt, delays, total_ms
- idempotency_guard.keys, accepted, duplicates
- consistency_guard.checks, violations, passed

## Principles

Retry with backoff, enforce idempotency, record consistency checks. All additive; engine behavior unchanged.
