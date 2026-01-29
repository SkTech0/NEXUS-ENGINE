#!/usr/bin/env node
/**
 * Engine-api service shell runner.
 * Independent entrypoint; spawns engine-api (dotnet) process boundary.
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
