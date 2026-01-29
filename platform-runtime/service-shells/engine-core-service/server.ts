/**
 * Engine-core service shell HTTP server.
 * Process boundary: own port, health, routes; delegates to adapter.
 */

import * as http from 'http';
import { loadConfig } from './config';
import type { EngineCoreServiceConfig } from './config';
import { runHealthCheck, runReadinessCheck, runLivenessCheck } from './health';
import { runStartup, registerStartupHook, runShutdown, registerShutdownHook } from './lifecycle';
import { execute } from './adapter';

const SERVICE_NAME = 'engine-core-service';

function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const s = Buffer.concat(chunks).toString('utf8');
        resolve(s ? JSON.parse(s) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function send(res: http.ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  config: EngineCoreServiceConfig
): Promise<void> {
  const url = req.url ?? '/';
  const method = req.method ?? 'GET';

  if (method === 'GET' && (url === '/health' || url === '/api/health')) {
    const result = await runHealthCheck(SERVICE_NAME);
    return send(res, 200, result);
  }
  if (method === 'GET' && (url === '/ready' || url === '/api/ready')) {
    const ok = await runReadinessCheck();
    return send(res, ok ? 200 : 503, { ready: ok });
  }
  if (method === 'GET' && (url === '/live' || url === '/api/live')) {
    const ok = await runLivenessCheck();
    return send(res, ok ? 200 : 503, { live: ok });
  }
  if (method === 'GET' && (url === '/api/status' || url === '/status')) {
    return send(res, 200, { service: SERVICE_NAME, status: 'running' });
  }
  if (method === 'POST' && (url === '/api/execute' || url === '/execute')) {
    const body = (await parseBody(req)) as { action?: string; parameters?: Record<string, unknown> };
    const result = await execute(config, { action: body?.action, parameters: body?.parameters });
    return send(res, 200, result);
  }

  send(res, 404, { error: 'Not found' });
}

export async function createServer(config: EngineCoreServiceConfig): Promise<http.Server> {
  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res, config);
    } catch (e) {
      send(res, 500, { error: String(e) });
    }
  });
  return server;
}

export async function startServer(server: http.Server, config: EngineCoreServiceConfig): Promise<void> {
  await runStartup();
  return new Promise((resolve) => {
    server.listen(config.port, config.host, () => {
      process.stdout.write(`${SERVICE_NAME} listening on ${config.host}:${config.port}\n`);
      resolve();
    });
  });
}

export function registerLifecycleHooks(
  server: http.Server,
  _config: EngineCoreServiceConfig,
  onRegister?: (baseUrl: string, port: number) => void
): void {
  registerStartupHook(async () => {
    const baseUrl = `http://${_config.host}:${_config.port}`;
    onRegister?.(baseUrl, _config.port);
  });
  registerShutdownHook(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
}

export async function stopServer(server: http.Server): Promise<void> {
  await runShutdown();
}
