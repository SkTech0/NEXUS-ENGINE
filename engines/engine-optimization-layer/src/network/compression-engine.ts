/**
 * Compression engine — optional compression for transport optimization.
 * Additive; no change to engine semantics. Uses pass-through when no compressor.
 */

import type { PerfMetric } from '../types';

export interface CompressionEngineConfig {
  readonly minSizeToCompress: number;
  readonly enabled: boolean;
}

export class CompressionEngine {
  private readonly config: CompressionEngineConfig;
  private readonly metrics = {
    compressedBytes: 0,
    decompressedBytes: 0,
    compressCount: 0,
    decompressCount: 0,
    skipped: 0,
  };

  constructor(config: Partial<CompressionEngineConfig> = {}) {
    this.config = {
      minSizeToCompress: config.minSizeToCompress ?? 256,
      enabled: config.enabled ?? false,
    };
  }

  compress(data: Uint8Array): Uint8Array {
    if (!this.config.enabled || data.byteLength < this.config.minSizeToCompress) {
      this.metrics.skipped++;
      return data.slice(0);
    }
    this.metrics.compressCount++;
    this.metrics.compressedBytes += data.byteLength;
    return data.slice(0);
  }

  decompress(data: Uint8Array): Uint8Array {
    if (!this.config.enabled) return data.slice(0);
    this.metrics.decompressCount++;
    this.metrics.decompressedBytes += data.byteLength;
    return data.slice(0);
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'compression.compressed_bytes', value: this.metrics.compressedBytes, unit: 'bytes', timestamp: now },
      { name: 'compression.decompressed_bytes', value: this.metrics.decompressedBytes, unit: 'bytes', timestamp: now },
      { name: 'compression.compress_count', value: this.metrics.compressCount, unit: 'count', timestamp: now },
      { name: 'compression.decompress_count', value: this.metrics.decompressCount, unit: 'count', timestamp: now },
      { name: 'compression.skipped', value: this.metrics.skipped, unit: 'count', timestamp: now },
    ];
  }
}
