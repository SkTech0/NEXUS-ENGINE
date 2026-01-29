/**
 * Engine-intelligence service shell adapter.
 * Wraps evaluate; no modification to engine-intelligence code.
 */

export interface EvaluateRequest {
  context?: string;
  inputs?: Record<string, unknown>;
}

export interface EvaluateResponse {
  outcome: string;
  confidence: number;
  payload?: Record<string, unknown>;
}

export async function evaluate(_request: EvaluateRequest): Promise<EvaluateResponse> {
  return { outcome: 'default', confidence: 0, payload: _request.inputs ?? {} };
}
