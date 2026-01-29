/**
 * Engine-api service shell adapter.
 * Wraps invocation to engine-api (HTTP client); no modification to engine-api code.
 */

import type { EngineApiServiceConfig } from './config';

export async function callEngineApi(
  config: EngineApiServiceConfig,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const baseUrl = `http://${config.host}:${config.port}`;
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, options);
}
