/**
 * Engine Core — Observability log schema (ERL-4).
 * Standard log entry for correlation, tracing, latency.
 */

export interface LogEntry {
  readonly trace_id: string;
  readonly engine_name: string;
  readonly engine_version: string;
  readonly operation: string;
  readonly status: 'ok' | 'error' | 'degraded';
  readonly latency_ms?: number;
  readonly error_code?: string;
  readonly error_type?: string;
  readonly message?: string;
  readonly timestamp: string;
  readonly correlation_id?: string;
  readonly [key: string]: unknown;
}

export interface ExecutionTrace {
  readonly traceId: string;
  readonly correlationId?: string;
  readonly operation: string;
  readonly startedAt: string;
  readonly latencyMs?: number;
  readonly status: 'ok' | 'error' | 'degraded';
}
