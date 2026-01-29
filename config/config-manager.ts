/**
 * Nexus Engine - Config Manager (scaffolding, additive only)
 *
 * Goals:
 * - Centralized config resolution for JS/TS runtimes.
 * - Precedence model: defaults → env pack → secrets → runtime.
 * - Support multiple secrets backends via a common resolver interface.
 *
 * Important:
 * - This module is NOT wired into runtime by default. It is safe scaffolding.
 * - No secrets in repo: use env var names / secret paths only.
 */

import * as fs from "fs";
import * as path from "path";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export interface SecretsResolver {
  resolve(key: string): Promise<string | undefined>;
}

export interface ConfigManagerOptions {
  repoRoot: string;
  env: string;
  defaults?: Record<string, unknown>;
  secretsResolver?: SecretsResolver;
  runtimeOverrides?: Record<string, unknown>;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function deepMerge<T extends Record<string, unknown>>(base: T, overlay: Record<string, unknown>): T {
  for (const [k, v] of Object.entries(overlay)) {
    const existing = base[k];
    if (isPlainObject(existing) && isPlainObject(v)) {
      base[k] = deepMerge({ ...existing }, v);
    } else {
      base[k] = v;
    }
  }
  return base;
}

function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
}

function readYaml(filePath: string): Record<string, unknown> {
  /**
   * Dependency note:
   * - YAML parsing typically uses `js-yaml` or organization-standard parser.
   * - This scaffold intentionally avoids adding new dependencies.
   */
  throw new Error(
    `YAML parsing not implemented in scaffold. Install a YAML parser and implement readYaml(). Missing: ${filePath}`,
  );
}

function envvarExpand(value: unknown): unknown {
  if (typeof value === "string") {
    if (value.startsWith("OVERRIDE_WITH_ENVVAR_")) {
      const varName = value.replace("OVERRIDE_WITH_ENVVAR_", "");
      return process.env[varName] ?? value;
    }
    if (value.includes("${") && value.includes("}")) {
      // Minimal ${VAR} expansion
      return value.replace(/\$\{([A-Z0-9_]+)\}/g, (_, v) => process.env[v] ?? `\${${v}}`);
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(envvarExpand);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = envvarExpand(v);
    return out;
  }
  return value;
}

function setByDottedPath(obj: Record<string, unknown>, dotted: string, value: unknown): void {
  const parts = dotted.split(".");
  let cur: Record<string, unknown> = obj;
  for (const p of parts.slice(0, -1)) {
    const next = cur[p];
    if (!isPlainObject(next)) cur[p] = {};
    cur = cur[p] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

export class ConfigManager {
  async load(options: ConfigManagerOptions): Promise<Record<string, unknown>> {
    const envDir = path.join(options.repoRoot, "env", options.env);

    const resolved: Record<string, unknown> = {};

    // 1) defaults
    if (options.defaults) deepMerge(resolved, options.defaults);

    // 2) env pack
    const appsettings = readJson(path.join(envDir, "appsettings.json"));
    const engine = readYaml(path.join(envDir, "engine-config.yaml"));
    const ai = readYaml(path.join(envDir, "ai-config.yaml"));
    const observability = readYaml(path.join(envDir, "observability.yaml"));
    const security = readYaml(path.join(envDir, "security.yaml"));
    const infra = readYaml(path.join(envDir, "infra.yaml"));

    deepMerge(resolved, { appsettings });
    deepMerge(resolved, { engine });
    deepMerge(resolved, { ai });
    deepMerge(resolved, { observability });
    deepMerge(resolved, { security });
    deepMerge(resolved, { infra });

    // Expand env placeholders
    const expanded = envvarExpand(resolved) as Record<string, unknown>;

    // 3) secrets injection (pattern scaffold)
    if (options.secretsResolver) {
      const csPrimary =
        ((expanded.appsettings as any)?.ConnectionStrings as any)?.Primary as unknown;
      if (typeof csPrimary === "string" && csPrimary.startsWith("OVERRIDE_WITH_ENVVAR_")) {
        const injected = await options.secretsResolver.resolve("ConnectionStrings:Primary");
        if (injected) {
          setByDottedPath(expanded, "appsettings.ConnectionStrings.Primary", injected);
        }
      }
    }

    // 4) runtime overrides
    if (options.runtimeOverrides) {
      const dottedLike = Object.keys(options.runtimeOverrides).every((k) => k.includes("."));
      if (dottedLike) {
        for (const [k, v] of Object.entries(options.runtimeOverrides)) setByDottedPath(expanded, k, v);
      } else {
        deepMerge(expanded, options.runtimeOverrides);
      }
    }

    return expanded;
  }
}

