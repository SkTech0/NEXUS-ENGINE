/**
 * Engine-api service shell server.
 * Starts the underlying engine-api process (dotnet); process boundary.
 */

import { spawn, type ChildProcess } from 'child_process';
import { loadConfig } from './config';
import type { EngineApiServiceConfig } from './config';
import { runStartup, registerStartupHook, runShutdown, registerShutdownHook } from './lifecycle';

let child: ChildProcess | null = null;

export function startEngineApiProcess(config: EngineApiServiceConfig): ChildProcess {
  child = spawn(config.dotnetPath, ['run', '--project', config.projectPath], {
    cwd: config.repoRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      ASPNETCORE_URLS: `http://${config.host}:${config.port}`,
      ASPNETCORE_ENVIRONMENT: config.env === 'production' ? 'Production' : 'Development',
    },
  });
  child.on('error', (err) => {
    console.error('engine-api-service:', err);
  });
  child.on('exit', (code, signal) => {
    child = null;
    if (code != null && code !== 0 && !config.env?.includes('test')) {
      process.exit(code);
    }
  });
  return child;
}

export function stopEngineApiProcess(): Promise<void> {
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

export async function run(config: EngineApiServiceConfig): Promise<void> {
  registerStartupHook(async () => {
    process.stdout.write(`engine-api-service starting dotnet at ${config.host}:${config.port}\n`);
  });
  registerShutdownHook(async () => {
    await stopEngineApiProcess();
  });
  await runStartup();
  startEngineApiProcess(config);
}

export async function stop(): Promise<void> {
  await runShutdown();
}
