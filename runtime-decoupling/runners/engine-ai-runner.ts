#!/usr/bin/env node
/**
 * Engine-ai standalone runner.
 * Independent process: HTTP server, spawns Python for infer or stub.
 */

import * as http from 'http';
import { spawn } from 'child_process';
import * as path from 'path';
import { loadAIConfig } from '../config/ai-config';
import { runStartup, registerStartupHook } from '../lifecycle/startup';
import { runShutdown, registerShutdownHook } from '../lifecycle/shutdown';
import { runHealthCheck } from '../lifecycle/health';
import { runReadinessCheck } from '../lifecycle/readiness';
import { runLivenessCheck } from '../lifecycle/liveness';
import { registerService } from '../orchestration/service-registry';

const SERVICE_NAME = 'engine-ai';

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

function inferViaPython(modelId: string, inputs: Record<string, unknown>): Promise<unknown> {
  const repoRoot = process.env['NEXUS_REPO_ROOT'] || path.resolve(__dirname, '../../..');
  const script = `
import json, sys
try:
  from engine_ai.inference.inference_service import InferenceService
  from engine_ai.inference.inference_service import InferenceRequest
  svc = InferenceService()
  req = InferenceRequest(model_id=sys.argv[1], inputs=json.loads(sys.argv[2]))
  out = svc.infer(req)
  print(json.dumps({"outputs": out.outputs, "latency_ms": out.latency_ms, "model_id": out.model_id}))
except Exception as e:
  print(json.dumps({"outputs": {}, "error": str(e)}), file=sys.stderr)
  sys.exit(1)
`;
  return new Promise((resolve, reject) => {
    const py = spawn(process.env['ENGINE_AI_PYTHON_PATH'] || 'python3', ['-c', script, modelId, JSON.stringify(inputs)], {
      cwd: path.join(repoRoot, 'engine-ai'),
      env: { ...process.env, PYTHONPATH: path.join(repoRoot, 'engine-ai') },
    });
    let stdout = '';
    let stderr = '';
    py.stdout.on('data', (d) => (stdout += d.toString()));
    py.stderr.on('data', (d) => (stderr += d.toString()));
    py.on('close', (code) => {
      if (code !== 0) {
        try {
          resolve(JSON.parse(stdout || '{}'));
        } catch {
          reject(new Error(stderr || 'Python infer failed'));
        }
      } else {
        try {
          resolve(JSON.parse(stdout));
        } catch {
          resolve({ outputs: {}, latency_ms: 0, model_id: modelId });
        }
      }
    });
  });
}

async function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  config: ReturnType<typeof loadAIConfig>
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
  if (method === 'POST' && (url === '/api/infer' || url === '/infer')) {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const modelId = (body['modelId'] ?? body['model_id'] ?? 'default') as string;
    const inputs = (body['inputs'] ?? {}) as Record<string, unknown>;
    try {
      const out = await inferViaPython(modelId, inputs);
      return send(res, 200, out);
    } catch (e) {
      return send(res, 200, { outputs: {}, latency_ms: 0, model_id: modelId });
    }
  }

  send(res, 404, { error: 'Not found' });
}

async function main(): Promise<void> {
  const config = loadAIConfig();
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
