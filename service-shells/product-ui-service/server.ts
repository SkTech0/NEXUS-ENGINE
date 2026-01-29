/**
 * Product-UI service shell server.
 * Starts the underlying product-ui process (ng serve); process boundary.
 */

import { spawn, type ChildProcess } from 'child_process';
import { loadConfig } from './config';
import type { ProductUiServiceConfig } from './config';
import { runStartup, registerStartupHook, runShutdown, registerShutdownHook } from './lifecycle';
import { getServeArgs } from './adapter';

let child: ChildProcess | null = null;

export function startProductUiProcess(config: ProductUiServiceConfig): ChildProcess {
  const isNpx = config.ngPath === 'npx' || config.ngPath.endsWith('npx');
  const args = getServeArgs(config);
  const cmd = config.ngPath;
  const spawnArgs = isNpx ? args : args.slice(1);

  child = spawn(cmd, spawnArgs, {
    cwd: config.productUiPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXUS_ENV: config.env,
    },
  });
  child.on('error', (err) => {
    console.error('product-ui-service:', err);
  });
  child.on('exit', (code, signal) => {
    child = null;
    if (code != null && code !== 0 && !config.env?.includes('test')) {
      process.exit(code);
    }
  });
  return child;
}

export function stopProductUiProcess(): Promise<void> {
  return new Promise((resolve) => {
    if (!child) {
      resolve();
      return;
    }
    child.once('exit', () => resolve());
    child.kill('SIGTERM');
    child = null;
  });
}

export async function run(config: ProductUiServiceConfig): Promise<void> {
  registerStartupHook(async () => {
    process.stdout.write(`product-ui-service starting at ${config.host}:${config.port}\n`);
  });
  registerShutdownHook(async () => {
    await stopProductUiProcess();
  });
  await runStartup();
  startProductUiProcess(config);
}

export async function stop(): Promise<void> {
  await runShutdown();
}
