/**
 * Engine Core — Error model (ERL-4).
 * Standard error types for unified handling; no business logic.
 */

export const ERROR_CODES = {
  VALIDATION: 'VALIDATION',
  ENGINE: 'ENGINE',
  DEPENDENCY: 'DEPENDENCY',
  TIMEOUT: 'TIMEOUT',
  EXECUTION: 'EXECUTION',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_TYPES = {
  ValidationError: 'ValidationError',
  EngineError: 'EngineError',
  DependencyError: 'DependencyError',
  TimeoutError: 'TimeoutError',
  ExecutionError: 'ExecutionError',
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

export interface EngineErrorPayload {
  readonly code: ErrorCode;
  readonly type: ErrorType;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly cause?: string;
  readonly traceId?: string;
}

/** Base contract for engine errors; implementations in engines. */
export interface IEngineError extends EngineErrorPayload {
  readonly retryable: boolean;
  toPayload(): EngineErrorPayload;
}
