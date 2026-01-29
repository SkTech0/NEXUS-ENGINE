/**
 * Load coordinator — load balancing and affinity routing.
 * Additive; no change to engine semantics.
 */

import type { PerfMetric } from '../types';

export interface LoadCoordinatorConfig {
  readonly maxNodes: number;
  readonly strategy: 'round-robin' | 'least-connections' | 'affinity';
}

export interface NodeState {
  readonly nodeId: string;
  connections: number;
  lastUsed: number;
}

export class LoadCoordinator {
  private readonly config: LoadCoordinatorConfig;
  private readonly nodes: NodeState[] = [];
  private roundRobinIndex = 0;
  private readonly metrics = { routed: 0, affinityHits: 0 };

  constructor(config: Partial<LoadCoordinatorConfig> = {}) {
    this.config = {
      maxNodes: config.maxNodes ?? 32,
      strategy: config.strategy ?? 'round-robin',
    };
  }

  registerNode(nodeId: string): void {
    if (this.nodes.length >= this.config.maxNodes) return;
    if (this.nodes.some((n) => n.nodeId === nodeId)) return;
    this.nodes.push({
      nodeId,
      connections: 0,
      lastUsed: Date.now(),
    });
  }

  route(affinityKey?: string): string | null {
    if (this.nodes.length === 0) return null;
    let node: NodeState;
    if (this.config.strategy === 'affinity' && affinityKey !== undefined) {
      const match = this.nodes.find((n) => n.nodeId === affinityKey);
      if (match !== undefined) {
        this.metrics.affinityHits++;
        node = match;
      } else {
        node = this.selectNode();
      }
    } else {
      node = this.selectNode();
    }
    node.connections++;
    node.lastUsed = Date.now();
    this.metrics.routed++;
    return node.nodeId;
  }

  private selectNode(): NodeState {
    if (this.config.strategy === 'least-connections') {
      let min = this.nodes[0]!;
      for (const n of this.nodes) {
        if (n.connections < min.connections) min = n;
      }
      return min;
    }
    const idx = this.roundRobinIndex % this.nodes.length;
    this.roundRobinIndex++;
    return this.nodes[idx]!;
  }

  release(nodeId: string): void {
    const node = this.nodes.find((n) => n.nodeId === nodeId);
    if (node !== undefined) node.connections = Math.max(0, node.connections - 1);
  }

  getMetrics(): PerfMetric[] {
    const now = Date.now();
    return [
      { name: 'load_coordinator.nodes', value: this.nodes.length, unit: 'count', timestamp: now },
      { name: 'load_coordinator.routed', value: this.metrics.routed, unit: 'count', timestamp: now },
      { name: 'load_coordinator.affinity_hits', value: this.metrics.affinityHits, unit: 'count', timestamp: now },
    ];
  }
}
