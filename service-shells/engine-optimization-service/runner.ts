#!/usr/bin/env node
import * as http from 'http';
import { loadConfig } from './config';
import { createServer, startServer, registerLifecycleHooks, stopServer } from './server';

async function main(): Promise<void> {
  const config = loadConfig();
  const server = await createServer(config);
  registerLifecycleHooks(server);
  await startServer(server, config);
  const onSignal = async (): Promise<void> => {
    await stopServer(server);
    process.exit(0);
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
