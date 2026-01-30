/**
 * Engine Core — Resilience policy contracts (ERL-4).
 * Timeouts, retries, circuit breaker, fallback.
 */

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly initialDelayMs: number;
  readonly maxDelayMs: number;
  readonly backoffMultiplier: number;
  readonly retryableErrors?: string[];
}

export interface TimeoutPolicy {
  readonly timeoutMs: number;
  readonly operation?: string;
}

export interface CircuitBreakerPolicy {
  readonly failureThreshold: number;
  readonly successThreshold: number;
  readonly openDurationMs: number;
  readonly halfOpenMaxCalls?: number;
}

export interface ResiliencePolicy {
  readonly retry?: RetryPolicy;
  readonly timeout?: TimeoutPolicy;
  readonly circuitBreaker?: CircuitBreakerPolicy;
}

export interface IResiliencePolicy {
  getRetryPolicy(operation: string): RetryPolicy | undefined;
  getTimeoutPolicy(operation: string): TimeoutPolicy | undefined;
  getCircuitBreakerPolicy(operation: string): CircuitBreakerPolicy | undefined;
}
