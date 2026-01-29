/**
 * Standalone runner entry points.
 * Run via: node runtime-decoupling/runners/engine-core-runner.js (or ts-node / nx)
 * Or: npx nx run runtime-decoupling:serve-engine-core etc.
 */

export const RUNNER_ENTRIES = {
  'engine-core': __dirname + '/engine-core-runner.ts',
  'engine-ai': __dirname + '/engine-ai-runner.ts',
  'engine-data': __dirname + '/engine-data-runner.ts',
  'engine-intelligence': __dirname + '/engine-intelligence-runner.ts',
  'engine-optimization': __dirname + '/engine-optimization-runner.ts',
  'engine-trust': __dirname + '/engine-trust-runner.ts',
  'engine-api': __dirname + '/engine-api-runner.ts',
} as const;
