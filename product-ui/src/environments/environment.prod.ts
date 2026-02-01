/**
 * Production API base URL. Must end with /api so requests hit /api/Engine/execute, /api/Trust/health, etc.
 * saasApiUrl: full SaaS API origin (e.g. https://saas-api-xxx.up.railway.app).
 *   Replaced at Docker build via SAAS_API_URL build-arg when deploying to Railway.
 */
export const environment = {
  production: true,
  apiUrl: 'https://helpful-optimism-production-7709.up.railway.app/api',
  saasApiUrl: 'https://saas-api-production-8be1.up.railway.app/api/saas',
};
