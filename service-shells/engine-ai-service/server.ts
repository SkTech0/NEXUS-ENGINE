/**
 * Engine-ai service shell HTTP server.
 */

import * as http from 'http';
import { loadConfig } from './config';
import type { EngineAiServiceConfig } from './config';
import { runHealthCheck, runReadinessCheck, runLivenessCheck } from './health';
import { runStartup, registerStartupHook, runShutdown, registerShutdownHook } from './lifecycle';
import { inferViaPython } from './adapter';

const SERVICE_NAME = 'engine-ai-service';

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
  config: EngineAiServiceConfig
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
  if (method === 'POST' && (url === '/api/infer' || url === '/infer')) {
    const body = (await parseBody(req)) as Record<string, unknown>;
    try {
      const out = await inferViaPython(config, body);
      return send(res, 200, out);
    } catch (e) {
      return send(res, 200, { outputs: {}, latency_ms: 0, error: String(e) });
    }
  }

  send(res, 404, { error: 'Not found' });
}

export async function createServer(config: EngineAiServiceConfig): Promise<http.Server> {
  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res, config);
    } catch (e) {
      send(res, 500, { error: String(e) });
    }
  });
  return server;
}

export async function startServer(server: http.Server, config: EngineAiServiceConfig): Promise<void> {
  await runStartup();
  return new Promise((resolve) => {
    server.listen(config.port, config.host, () => {
      process.stdout.write(`${SERVICE_NAME} listening on ${config.host}:${config.port}\n`);
      resolve();
    });
  });
}

export function registerLifecycleHooks(server: http.Server, _config: EngineAiServiceConfig): void {
  registerStartupHook(async () => {});
  registerShutdownHook(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
}

export async function stopServer(server: http.Server): Promise<void> {
  await runShutdown();
}
