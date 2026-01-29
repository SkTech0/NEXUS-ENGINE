#!/usr/bin/env node
/**
 * Product-UI service shell runner.
 * Independent entrypoint; spawns product-ui (ng serve) process boundary.
 */

import { loadConfig } from './config';
import { run, stop } from './server';

async function main(): Promise<void> {
  const config = loadConfig();
  await run(config);

  const onSignal = async (): Promise<void> => {
    await stop();
    process.exit(0);
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
