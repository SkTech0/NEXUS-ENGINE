import * as http from 'http';
import { loadConfig } from './config';
import type { EngineDistributedServiceConfig } from './config';
import { runHealthCheck, runReadinessCheck, runLivenessCheck } from './health';
import { runStartup, registerStartupHook, runShutdown, registerShutdownHook } from './lifecycle';
import { coordinate } from './adapter';

const SERVICE_NAME = 'engine-distributed-service';

function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
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
  config: EngineDistributedServiceConfig
): Promise<void> {
  const url = req.url ?? '/';
  const method = req.method ?? 'GET';

  if (method === 'GET' && (url === '/health' || url === '/api/health')) {
    return send(res, 200, await runHealthCheck(SERVICE_NAME));
  }
  if (method === 'GET' && (url === '/ready' || url === '/api/ready')) {
    return send(res, (await runReadinessCheck()) ? 200 : 503, { ready: await runReadinessCheck() });
  }
  if (method === 'GET' && (url === '/live' || url === '/api/live')) {
    return send(res, (await runLivenessCheck()) ? 200 : 503, { live: await runLivenessCheck() });
  }
  if (method === 'GET' && (url === '/api/status' || url === '/status')) {
    return send(res, 200, { service: SERVICE_NAME, status: 'running' });
  }
  if (method === 'POST' && (url === '/api/coordinate' || url === '/coordinate')) {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const out = await coordinate(body);
    return send(res, 200, out);
  }
  send(res, 404, { error: 'Not found' });
}

export async function createServer(config: EngineDistributedServiceConfig): Promise<http.Server> {
  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res, config);
    } catch (e) {
      send(res, 500, { error: String(e) });
    }
  });
  return server;
}

export async function startServer(server: http.Server, config: EngineDistributedServiceConfig): Promise<void> {
  await runStartup();
  return new Promise((resolve) => {
    server.listen(config.port, config.host, () => {
      process.stdout.write(`${SERVICE_NAME} listening on ${config.host}:${config.port}\n`);
      resolve();
    });
  });
}

export function registerLifecycleHooks(server: http.Server): void {
  registerStartupHook(async () => {});
  registerShutdownHook(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
}

export async function stopServer(server: http.Server): Promise<void> {
  await runShutdown();
}
