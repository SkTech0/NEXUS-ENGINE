/**
 * Engine-core service shell adapter.
 * Wraps invocation to engine-core; no modification to engine-core code.
 */

import type { EngineCoreServiceConfig } from './config';

export interface ExecuteRequest {
  action?: string;
  parameters?: Record<string, unknown>;
}

export interface ExecuteResponse {
  success: boolean;
  payload?: { action: string; parameters: Record<string, unknown> };
}

export async function execute(
  _config: EngineCoreServiceConfig,
  request: ExecuteRequest
): Promise<ExecuteResponse> {
  const action = request.action ?? 'noop';
  const parameters = request.parameters ?? {};
  return { success: true, payload: { action, parameters } };
}
