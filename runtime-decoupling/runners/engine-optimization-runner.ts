#!/usr/bin/env node
/**
 * Engine-optimization standalone runner.
 * Independent process: HTTP server, optimize endpoint.
 */

import * as http from 'http';
import { loadOptimizationConfig } from '../config/optimization-config';
import { runStartup, registerStartupHook } from '../lifecycle/startup';
import { runShutdown, registerShutdownHook } from '../lifecycle/shutdown';
import { runHealthCheck } from '../lifecycle/health';
import { runReadinessCheck } from '../lifecycle/readiness';
import { runLivenessCheck } from '../lifecycle/liveness';
import { registerService } from '../orchestration/service-registry';

const SERVICE_NAME = 'engine-optimization';

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
  config: ReturnType<typeof loadOptimizationConfig>
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
  if (method === 'POST' && (url === '/api/optimize' || url === '/optimize')) {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const targetId = (body['targetId'] ?? body['target_id'] ?? '') as string;
    const objective = (body['objective'] ?? 'minimize') as string;
    return send(res, 200, { success: true, result: { targetId, objective } });
  }

  send(res, 404, { error: 'Not found' });
}

async function main(): Promise<void> {
  const config = loadOptimizationConfig();
  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res, config);
    } catch (e) {
      send(res, 500, { error: String(e) });
    }
  });

  registerStartupHook(async () => {
    registerService(SERVICE_NAME, `http://${config.host}:${config.port}`, config.port);
  });

  registerShutdownHook(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  await runStartup();
  server.listen(config.port, config.host, () => {
    process.stdout.write(`${SERVICE_NAME} listening on ${config.host}:${config.port}\n`);
  });

  const onSignal = async (): Promise<void> => {
    await runShutdown();
    process.exit(0);
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
