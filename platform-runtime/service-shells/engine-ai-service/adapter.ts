/**
 * Engine-ai service shell adapter.
 * Invokes engine-ai (Python) via subprocess; no modification to engine-ai code.
 */

import { spawn } from 'child_process';
import type { EngineAiServiceConfig } from './config';

export interface InferRequest {
  modelId?: string;
  model_id?: string;
  inputs?: Record<string, unknown>;
}

export interface InferResponse {
  outputs?: Record<string, unknown>;
  latency_ms?: number;
  model_id?: string;
  error?: string;
}

const inferScript = `
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

export function inferViaPython(config: EngineAiServiceConfig, request: InferRequest): Promise<InferResponse> {
  const modelId = (request.modelId ?? request.model_id ?? 'default') as string;
  const inputs = request.inputs ?? {};
  return new Promise((resolve, reject) => {
    const py = spawn(config.pythonPath, ['-c', inferScript, modelId, JSON.stringify(inputs)], {
      cwd: config.modulePath,
      env: { ...process.env, PYTHONPATH: config.modulePath },
    });
    let stdout = '';
    let stderr = '';
    py.stdout.on('data', (d) => (stdout += d.toString()));
    py.stderr.on('data', (d) => (stderr += d.toString()));
    py.on('close', (code) => {
      try {
        const out = JSON.parse(stdout || '{}') as InferResponse;
        if (code !== 0) {
          out.error = stderr || 'Python infer failed';
        }
        resolve(out);
      } catch {
        resolve({ outputs: {}, latency_ms: 0, model_id: modelId, error: stderr || 'Parse error' });
      }
    });
  });
}
