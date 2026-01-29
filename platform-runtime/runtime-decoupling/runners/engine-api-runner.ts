#!/usr/bin/env node
/**
 * Engine-api standalone runner (launcher).
 * Spawns dotnet run for engine-api; independent process boundary.
 */

import { spawn } from 'child_process';
import * as path from 'path';

const repoRoot = process.env['NEXUS_REPO_ROOT'] || path.resolve(__dirname, '../../..');
const projectPath = path.join(repoRoot, 'apps/engine-api', 'src', 'EngineApi', 'EngineApi.csproj');

const child = spawn('dotnet', ['run', '--project', projectPath], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: { ...process.env },
});

child.on('error', (err) => {
  console.error('engine-api-runner:', err);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
