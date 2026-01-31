/**
 * Production API base URL. Must end with /api so requests hit /api/Engine/execute, /api/Trust/health, etc.
 * - Same host: use '/api' and proxy /api to the backend.
 * - Different host (e.g. UI and Engine API on separate Railway services): set the full API origin
 *   including /api, e.g. https://your-engine-api.up.railway.app/api
 */
export const environment = {
  production: true,
  apiUrl: 'https://helpful-optimism-production-7709.up.railway.app/api',
};
