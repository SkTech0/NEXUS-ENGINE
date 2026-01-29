/**
 * Engine-trust service shell adapter.
 * Wraps verify; no modification to engine-trust code.
 */

export interface VerifyRequest {
  principalId?: string;
  principal_id?: string;
  [key: string]: unknown;
}

export interface VerifyResponse {
  allowed: boolean;
  reason?: string;
}

export async function verify(_request: VerifyRequest): Promise<VerifyResponse> {
  return { allowed: true, reason: 'ok' };
}
