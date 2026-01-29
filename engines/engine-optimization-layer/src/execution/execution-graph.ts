/**
 * Execution graph — DAG of stages with dependency ordering for parallel execution.
 * Additive; does not change stage semantics.
 */

export interface GraphNode {
  readonly id: string;
  readonly run: () => Promise<unknown>;
  readonly deps: readonly string[]; // node ids that must complete first
}

export class ExecutionGraph {
  private readonly nodes: Map<string, GraphNode> = new Map();
  private readonly completed: Set<string> = new Set();
  private readonly runOrder: string[] = [];

  addNode(node: GraphNode): this {
    this.nodes.set(node.id, node);
    return this;
  }

  private async runNode(id: string): Promise<unknown> {
    const node = this.nodes.get(id);
    if (!node) throw new Error(`Unknown node: ${id}`);
    for (const dep of node.deps) {
      if (!this.completed.has(dep)) {
        await this.runNode(dep);
      }
    }
    const result = await node.run();
    this.completed.add(id);
    this.runOrder.push(id);
    return result;
  }

  async run(): Promise<Map<string, unknown>> {
    this.completed.clear();
    this.runOrder.length = 0;
    const results = new Map<string, unknown>();
    const topLevel = [...this.nodes.keys()].filter(
      (id) => ![...this.nodes.values()].some((n) => n.deps.includes(id))
    );
    const runAll = async (ids: string[]) => {
      await Promise.all(
        ids.map(async (id) => {
          if (this.completed.has(id)) return;
          const node = this.nodes.get(id)!;
          for (const dep of node.deps) {
            if (!this.completed.has(dep)) await runAll([dep]);
          }
          if (!this.completed.has(id)) {
            const r = await node.run();
            this.completed.add(id);
            this.runOrder.push(id);
            results.set(id, r);
          }
        })
      );
    };
    await runAll([...this.nodes.keys()]);
    return results;
  }

  getRunOrder(): readonly string[] {
    return this.runOrder;
  }

  getNodeCount(): number {
    return this.nodes.size;
  }
}
