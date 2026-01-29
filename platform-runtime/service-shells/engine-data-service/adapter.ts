/**
 * Engine-data service shell adapter.
 * In-process store for data operations; no modification to engine-data code.
 */

const store = new Map<string, unknown>();

export function get(key: string, namespace: string): unknown {
  return store.get(`${namespace}:${key}`);
}

export function put(key: string, value: unknown, namespace: string): void {
  store.set(`${namespace}:${key}`, value);
}
