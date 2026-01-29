/**
 * API Gateway for decoupled NEXUS-ENGINE services.
 * Single entrypoint; routes to service-shells via discovery.
 * No modification to existing engine code.
 */

import * as http from 'http';
import * as url from 'url';
import { getService, listServices } from './service-registry';
import { discoverService } from './discovery';

const GATEWAY_PORT = Number(process.env['GATEWAY_PORT']) || 8080;
const GATEWAY_HOST = process.env['GATEWAY_HOST'] || '0.0.0.0';

const ROUTE_PREFIXES: Record<string, string> = {
  '/api/core': 'engine-core',
  '/api/engine': 'engine-core',
  '/api/ai': 'engine-ai',
  '/api/data': 'engine-data',
  '/api/intelligence': 'engine-intelligence',
  '/api/optimization': 'engine-optimization',
  '/api/trust': 'engine-trust',
  '/api/distributed': 'engine-distributed',
  '/api/engine-api': 'engine-api',
};

function send(res: http.ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function parseBody(req: http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function proxy(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  targetBaseUrl: string,
  path: string,
  method: string,
  body: Buffer | null
): Promise<void> {
  const targetUrl = `${targetBaseUrl.replace(/\/$/, '')}${path}`;
  try {
    const headers: Record<string, string> = { ...(req.headers as Record<string, string>) };
    delete headers.host;
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body && body.length > 0 ? body : undefined,
    });
    const text = await response.text();
    res.writeHead(response.status, { 'Content-Type': response.headers.get('content-type') || 'application/json' });
    res.end(text);
  } catch (e) {
    send(res, 502, { error: 'Bad Gateway', message: String(e) });
  }
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const parsed = url.parse(req.url ?? '/', true);
  const path = parsed.pathname ?? '/';
  const method = req.method ?? 'GET';

  if (method === 'GET' && (path === '/health' || path === '/api/health' || path === '/gateway/health')) {
    const services = listServices();
    const healthy = services.filter((s) => s.healthy).length;
    return send(res, 200, {
      status: 'healthy',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      upstream: { total: services.length, healthy },
    });
  }

  if (method === 'GET' && (path === '/gateway/services' || path === '/api/gateway/services')) {
    return send(res, 200, listServices());
  }

  let targetService: string | null = null;
  for (const [prefix, service] of Object.entries(ROUTE_PREFIXES)) {
    if (path.startsWith(prefix)) {
      targetService = service;
      break;
    }
  }

  if (!targetService) {
    return send(res, 404, { error: 'Not found', path });
  }

  const baseUrl = getService(targetService)?.baseUrl ?? (await discoverService(targetService));
  if (!baseUrl) {
    return send(res, 503, { error: 'Service unavailable', service: targetService });
  }

  const body = method !== 'GET' && method !== 'HEAD' ? await parseBody(req) : null;
  await proxy(req, res, baseUrl, path, method, body);
}

export function startGateway(): http.Server {
  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res);
    } catch (e) {
      send(res, 500, { error: String(e) });
    }
  });
  server.listen(GATEWAY_PORT, GATEWAY_HOST, () => {
    process.stdout.write(`api-gateway listening on ${GATEWAY_HOST}:${GATEWAY_PORT}\n`);
  });
  return server;
}
