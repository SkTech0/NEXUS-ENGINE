/**
 * Runner for engine-trust-service. Starts process, loads config, registers, health.
 */

import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as http from 'http';

const SERVICE_NAME = 'engine-trust-service';
const DEFAULT_PORT = 5014;
const REPO_ROOT = process.env['NEXUS_REPO_ROOT'] || path.resolve(__dirname, '../..');
const SERVICE_DIR = path.join(REPO_ROOT, 'services', 'engine-trust-service');

let child: ChildProcess | null = null;

export function getConfig(): { host: string; port: number } {
  return {
    host: process.env['ENGINE_TRUST_SERVICE_HOST'] || '0.0.0.0',
    port: Number(process.env['ENGINE_TRUST_SERVICE_PORT']) || DEFAULT_PORT,
  };
}

export function startProcess(): ChildProcess {
  const config = getConfig();
  child = spawn(process.env['PYTHON_PATH'] || 'python3', ['run.py'], {
    cwd: SERVICE_DIR,
    env: { ...process.env, ENGINE_TRUST_SERVICE_PORT: String(config.port), PYTHONPATH: SERVICE_DIR },
    stdio: 'inherit',
  });
  child.on('error', (err) => console.error(`${SERVICE_NAME} process error:`, err));
  child.on('exit', (code) => console.info(`${SERVICE_NAME} exited with code ${code}`));
  return child;
}

export function stopProcess(): void {
  if (child) {
    child.kill('SIGTERM');
    child = null;
  }
}

export function registerWithGateway(baseUrl: string, port: number): void {
  try {
    const { registerService } = require('../orchestration/service-registry');
    registerService(SERVICE_NAME, baseUrl, port);
  } catch {}
}

export function healthCheck(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/health`, (res) => resolve(res.statusCode === 200));
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => { req.destroy(); resolve(false); });
  });
}
