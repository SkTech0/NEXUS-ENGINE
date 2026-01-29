/**
 * Product-UI service shell config.
 * Independent config boundary; no shared state with product-ui.
 */

import * as path from 'path';

export interface ProductUiServiceConfig {
  name: string;
  port: number;
  host: string;
  logLevel: string;
  env: string;
  repoRoot: string;
  productUiPath: string;
  ngPath: string;
}

const repoRoot = process.env['NEXUS_REPO_ROOT'] || process.cwd();
const defaultProductUiPath = path.join(repoRoot, 'product-ui');

const DEFAULTS: ProductUiServiceConfig = {
  name: 'product-ui-service',
  port: Number(process.env['PRODUCT_UI_SERVICE_PORT']) || 4200,
  host: process.env['PRODUCT_UI_SERVICE_HOST'] || '0.0.0.0',
  logLevel: process.env['PRODUCT_UI_SERVICE_LOG_LEVEL'] || 'info',
  env: process.env['NEXUS_ENV'] || 'development',
  repoRoot,
  productUiPath: process.env['PRODUCT_UI_PATH'] || defaultProductUiPath,
  ngPath: process.env['NG_PATH'] || 'npx',
};

export function loadConfig(overrides?: Partial<ProductUiServiceConfig>): ProductUiServiceConfig {
  return { ...DEFAULTS, ...overrides };
}
