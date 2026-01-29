/**
 * Shared types for ECV. Observes engine contracts; does not define engine behavior.
 */

export interface ValidationInput {
  readonly payload: unknown;
  readonly traceId?: string;
  readonly timestamp?: number;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings?: readonly string[];
  readonly metadata?: Record<string, unknown>;
}

export interface ReplayRecord {
  readonly traceId: string;
  readonly input: unknown;
  readonly output: unknown;
  readonly timestamp: number;
  readonly seed?: number;
}

export interface SnapshotRecord {
  readonly id: string;
  readonly traceId: string;
  readonly state: unknown;
  readonly output?: unknown;
  readonly timestamp: number;
}

export interface InvariantCheck<T = unknown> {
  readonly name: string;
  check(state: T): boolean;
  message?: string;
}

export interface StateTransition {
  readonly from: string;
  readonly to: string;
  readonly event?: string;
}

export interface ChaosAction {
  readonly type: 'delay' | 'fail' | 'drop' | 'duplicate' | 'reorder';
  readonly target?: string;
  readonly probability: number;
  readonly params?: Record<string, unknown>;
}
