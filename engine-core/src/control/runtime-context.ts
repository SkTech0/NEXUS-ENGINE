/**
 * Engine Core — Control plane / runtime context (ERL-4).
 * Correlation, config, feature flags, execution guardrails.
 */

export type Environment = 'dev' | 'test' | 'prod';

export interface EngineRuntimeContext {
  readonly traceId: string;
  readonly correlationId?: string;
  readonly environment: Environment;
  readonly engineName: string;
  readonly engineVersion: string;
  readonly featureFlags?: Record<string, boolean>;
  readonly config?: Record<string, unknown>;
}

export interface IEngineRuntimeContext {
  getContext(): EngineRuntimeContext;
  getTraceId(): string;
  getCorrelationId(): string | undefined;
  getEnvironment(): Environment;
  isFeatureEnabled(name: string): boolean;
}
