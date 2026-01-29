# Evaluation Metrics

Definitions and usage of metrics for Nexus Engine research and experiments.

## 1. Distributed Systems

| Metric | Definition | Unit | Use |
|--------|------------|------|-----|
| **Commit latency** | Time from propose to learn (Paxos) or append (Raft) | ms | Consensus experiments |
| **Throughput** | Commits (or ops) per second | ops/s | Consensus, replication |
| **Recovery time** | Time to stable leader / quorum after failure | s | Fault tolerance |
| **Conflict rate** | Fraction of updates requiring merge or conflict resolution | ratio | Vector clocks, CRDTs |
| **Message complexity** | Messages per consensus round (or per op) | count | Protocol comparison |

## 2. Data & Indexing

| Metric | Definition | Unit | Use |
|--------|------------|------|-----|
| **Query latency (P50 / P95 / P99)** | Percentile latency of read/query | ms | Data engines, indexing |
| **Throughput** | Queries or writes per second | ops/s | Data layer |
| **Index size** | Memory or disk for index structures | MB / count | Indexing engine |
| **Recall @ K** | Fraction of relevant items in top-K (vector search) | ratio | Vector store |

## 3. Intelligence & AI

| Metric | Definition | Unit | Use |
|--------|------------|------|-----|
| **Inference latency** | Time from request to response (inference_service) | ms | AI pipelines |
| **Accuracy** | Fraction correct (evaluator accuracy) | ratio | Classification / decision |
| **Confidence calibration** | Alignment of predicted confidence with empirical accuracy | curve / ECE | Trust, evaluator |
| **Reasoning steps** | Number of step() until fixpoint (reasoning_engine) | count | Scalability |
| **Decision consistency** | Agreement of decision_engine across similar contexts | ratio | Reproducibility |

## 4. Trust & Compliance

| Metric | Definition | Unit | Use |
|--------|------------|------|-----|
| **Verification rate** | Fraction of claims verified valid (verification_engine) | ratio | Verification experiments |
| **Compliance score** | Fraction of checks passed (compliance_engine) | ratio | Compliance automation |
| **Audit coverage** | Fraction of actions logged (audit_logger) | ratio | Audit completeness |
| **Trust score AUC** | AUC of trust score vs binary ground truth | AUC | Trust score engine |

## 5. SaaS & Monetization

| Metric | Definition | Unit | Use |
|--------|------------|------|-----|
| **Tenant isolation** | Zero cross-tenant data/usage leakage | pass/fail | Multi-tenant |
| **Billing accuracy** | Match between expected and generated invoice/revenue | ratio / error | Billing, revenue_tracker |
| **Usage quota accuracy** | Usage_tracker total vs actual usage; over-limit detection | ratio / delay | Usage tracking |

## 6. Platform & Enterprise

| Metric | Definition | Unit | Use |
|--------|------------|------|-----|
| **Plugin load time** | Time to register and first run (plugin_engine) | ms | Extension framework |
| **Policy eval latency** | evaluate() time (policy_engine) | ms | Policy engine |
| **SLA breach rate** | Fraction of checks where SLA not met (sla_manager) | ratio | SLA experiments |

## Aggregation and Reporting

- **Per run**: Log raw values; compute mean, std, min, max, percentiles where applicable.
- **Across runs**: Report mean ± std or confidence interval; note sample size and seeds.
- **Baselines**: Always compare against a baseline (e.g., single-node, no optimization, default policy).

## References

- Experiment design: `docs/research/experiment_design.md`
- Research topics: `docs/research/research_topics.md`
