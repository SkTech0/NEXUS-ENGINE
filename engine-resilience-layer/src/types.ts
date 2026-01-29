/**
 * Shared types for ERH. Resilience config and metrics only; no engine semantics.
 */

export interface ResilienceMetric {
  readonly name: string;
  readonly value: number;
  readonly unit: string;
  readonly timestamp: number;
}

export interface CircuitBreakerConfig {
  readonly failureThreshold: number;
  readonly successThreshold: number;
  readonly openDurationMs: number;
  readonly halfOpenMaxCalls: number;
}

export interface BulkheadConfig {
  readonly maxConcurrency: number;
  readonly maxQueue: number;
  readonly queueTimeoutMs: number;
}

export interface RetryConfig {
  readonly maxAttempts: number;
  readonly initialDelayMs: number;
  readonly maxDelayMs: number;
  readonly multiplier: number;
  readonly retryableErrors: readonly string[];
}

export interface BackoffConfig {
  readonly strategy: 'linear' | 'exponential' | 'jitter';
  readonly baseMs: number;
  readonly maxMs: number;
  readonly jitterFactor: number;
}

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface RecoveryCheckpoint {
  readonly id: string;
  readonly timestamp: number;
  readonly payload: unknown;
}

export interface FailoverTarget {
  readonly id: string;
  readonly priority: number;
  readonly healthy: boolean;
}
