/**
 * Serialization engine — optimized encode/decode with optional pooling.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface SerializerConfig {
  readonly usePool: boolean;
  readonly maxCachedEncodings: number;
}

export class SerializationEngine {
  private readonly config: SerializerConfig;
  private readonly metrics = {
    encodeCount: 0,
    decodeCount: 0,
    encodeBytes: 0,
    decodeBytes: 0,
    cacheHits: 0,
  };
  private readonly encodeCache = new Map<string, Uint8Array>();

  constructor(config: Partial<SerializerConfig> = {}) {
    this.config = {
      usePool: config.usePool ?? false,
      maxCachedEncodings: config.maxCachedEncodings ?? 256,
    };
  }

  encode(text: string): Uint8Array {
    const key = this.config.usePool ? text : '';
    if (this.config.usePool && key && this.encodeCache.has(key)) {
      this.metrics.cacheHits++;
      const cached = this.encodeCache.get(key)!;
      return cached.slice(0);
    }
    const encoder = new TextEncoder();
    const encoded = encoder.encode(text);
    this.metrics.encodeCount++;
    this.metrics.encodeBytes += encoded.byteLength;
    if (this.config.usePool && key && this.encodeCache.size < this.config.maxCachedEncodings) {
      this.encodeCache.set(key, encoded);
    }
    return encoded;
  }

  decode(bytes: Uint8Array): string {
    const decoder = new TextDecoder();
    const decoded = decoder.decode(bytes);
    this.metrics.decodeCount++;
    this.metrics.decodeBytes += bytes.byteLength;
    return decoded;
  }

  clearCache(): void {
    this.encodeCache.clear();
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'serializer.encode_count', value: this.metrics.encodeCount, unit: 'count', timestamp: now },
      { name: 'serializer.decode_count', value: this.metrics.decodeCount, unit: 'count', timestamp: now },
      { name: 'serializer.encode_bytes', value: this.metrics.encodeBytes, unit: 'bytes', timestamp: now },
      { name: 'serializer.decode_bytes', value: this.metrics.decodeBytes, unit: 'bytes', timestamp: now },
      { name: 'serializer.cache_hits', value: this.metrics.cacheHits, unit: 'count', timestamp: now },
    ];
  }
}
