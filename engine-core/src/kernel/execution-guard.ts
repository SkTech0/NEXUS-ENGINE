/**
 * Engine Core — Execution guardrails (ERL-4).
 * Kernel-level: invariant checks, safe failure, no domain logic.
 */

import type { ValidationResult } from '../validation';
import type { EngineErrorPayload } from '../errors';

export interface ExecutionGuardContext {
  readonly operation: string;
  readonly traceId?: string;
  readonly allowDegraded?: boolean;
}

export interface ExecutionGuardResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly validation?: ValidationResult;
  readonly error?: EngineErrorPayload;
  readonly degraded?: boolean;
}

/** Contract for execution guardrails; implementations in engines. */
export interface IExecutionGuard {
  guard<T>(
    operation: string,
    input: unknown,
    execute: (validated: unknown) => Promise<T>,
    context?: Partial<ExecutionGuardContext>
  ): Promise<ExecutionGuardResult<T>>;
}
