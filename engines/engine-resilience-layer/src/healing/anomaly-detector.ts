/**
 * Anomaly detector — detect anomalies for self-healing triggers.
 * Additive; no change to engine semantics.
 */

import type { ResilienceMetric } from '../types';

export interface AnomalyDetectorConfig {
  readonly windowSize: number;
  readonly thresholdSigma: number;
  readonly minSamples: number;
}

export class AnomalyDetector {
  private readonly config: AnomalyDetectorConfig;
  private readonly samples: number[] = [];
  private readonly metrics = { anomalies: 0, samples: 0 };

  constructor(config: Partial<AnomalyDetectorConfig> = {}) {
    this.config = {
      windowSize: config.windowSize ?? 100,
      thresholdSigma: config.thresholdSigma ?? 3,
      minSamples: config.minSamples ?? 10,
    };
  }

  record(value: number): void {
    if (this.samples.length >= this.config.windowSize) {
      this.samples.shift();
    }
    this.samples.push(value);
    this.metrics.samples++;
  }

  isAnomaly(value: number): boolean {
    if (this.samples.length < this.config.minSamples) return false;
    const mean = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    const variance =
      this.samples.reduce((s, x) => s + (x - mean) ** 2, 0) / this.samples.length;
    const std = Math.sqrt(variance) || 1;
    const z = Math.abs(value - mean) / std;
    if (z >= this.config.thresholdSigma) {
      this.metrics.anomalies++;
      return true;
    }
    return false;
  }

  getMetrics(): ResilienceMetric[] {
    const now = Date.now();
    return [
      { name: 'anomaly_detector.samples', value: this.samples.length, unit: 'count', timestamp: now },
      { name: 'anomaly_detector.anomalies', value: this.metrics.anomalies, unit: 'count', timestamp: now },
      { name: 'anomaly_detector.total_samples', value: this.metrics.samples, unit: 'count', timestamp: now },
    ];
  }
}
