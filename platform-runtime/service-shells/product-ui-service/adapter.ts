/**
 * Product-UI service shell adapter.
 * Wraps invocation to product-ui (e.g. build/serve); no modification to product-ui code.
 */

import type { ProductUiServiceConfig } from './config';

export function getServeArgs(config: ProductUiServiceConfig): string[] {
  return [
    'ng',
    'serve',
    'product-ui',
    '--configuration',
    config.env === 'production' ? 'production' : 'development',
    '--port',
    String(config.port),
    '--host',
    config.host === '0.0.0.0' ? '0.0.0.0' : config.host,
  ];
}
