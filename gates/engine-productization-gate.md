# Engine Productization Gate

**Status:** Standard  
**Owner:** Platform Architecture / Product  
**Classification:** Gates — Productization  
**Version:** 1.0

---

## 1. Purpose

This gate defines the criteria that must be met before NEXUS engines are declared productized: contract-compliant, certified, API-productized, and security-hardened. Passage of this gate is required for commercial engine product and sellable API.

---

## 2. Gate Criteria

### 2.1 Engine Core

- [ ] All exposed engines implement engine-core/specs/engine-contracts.md (execute, name, lifecycle, health).
- [ ] Engine lifecycle and state machine per engine-core/specs/engine-lifecycle.md, engine-states.md; state transitions logged and observable.
- [ ] Failure and recovery model per engine-core/specs/engine-failure-model.md, engine-recovery-model.md; failure signaling and recovery tested.
- [ ] Idempotency and (where required) determinism per engine-core/specs/engine-idempotency.md, engine-determinism.md; replay support where required (engine-replay.md).
- [ ] Orchestration and dependency graph per engine-core/specs/engine-orchestration.md; no undocumented coupling.

### 2.2 Certification

- [ ] Performance certification (certification/performance.md) passing for core APIs/engines; latency and throughput targets met.
- [ ] Stability certification (certification/stability.md) passing; no latency or resource drift over soak period.
- [ ] Reliability certification (certification/reliability.md) passing; availability and fault-tolerance tests pass.
- [ ] Scalability certification (certification/scalability.md) passing; horizontal scaling and overload behavior per platform standards.
- [ ] Determinism certification (certification/determinism.md) for core decision engines where required; consistency certification (certification/consistency.md) where required.

### 2.3 API Productization

- [ ] API versioning (api-platform/versioning.md) and deprecation policy (api-platform/deprecation.md) live; compatibility matrix (api-platform/compatibility.md) published.
- [ ] Consumer contracts and API contracts (api-platform/contracts.md) defined and tested; breaking-change governance (api-platform/api-governance.md) in place.
- [ ] SDK strategy (api-platform/sdk-strategy.md) implemented for at least one primary language; SDK docs and examples available.
- [ ] API stability guarantees and backward compatibility verified in CI; contract tests passing.

### 2.4 Security

- [ ] Engine identity and authn/authz per security/engine/identity.md, auth.md, authz.md; zero-trust and policy per security/engine/zero-trust.md, policy.md.
- [ ] Secure engine-to-engine comms; trust boundaries documented (security/engine/trust-model.md).
- [ ] Secrets in secrets manager; no secrets in code/config; rotation procedure documented.
- [ ] Security review or penetration test completed; critical/high findings remediated or accepted with risk.

### 2.5 Governance and Lineage

- [ ] Decision lineage and (where applicable) data lineage capture per governance/data/decision-lineage.md, data-lineage.md; retention and access control in place.
- [ ] Correlation ID and trace propagation per governance/data/causality.md; temporal consistency documented (governance/data/temporal-model.md).

---

## 3. Gate Process

- **Owner:** Platform architect or product lead; sign-off from engineering, security, and (where applicable) compliance.
- **Evidence:** Checklist above with evidence (docs, test results, certification reports, security report); gaps and remediation plan if not fully met.
- **Pass:** All criteria met (or accepted exceptions documented); gate passed and date recorded.
- **Fail:** One or more criteria not met; remediation plan and re-gate date set.

---

## 4. Outcome

- **Pass:** Engines and API are declared productized; eligible for commercial launch scope (subject to market-entry gate).
- **Fail:** Not eligible for commercial engine product until gate is passed.

---

## 5. References

- [engine-core/specs/](../engine-core/specs/)
- [certification/](../certification/)
- [api-platform/](../api-platform/)
- [security/engine/](../security/engine/)
- [governance/data/](../governance/data/)
- [engine-core/readiness/erl-model.md](../engine-core/readiness/erl-model.md) (ERL-5)
- [market-readiness/technical.md](../market-readiness/technical.md)
- [platform-readiness-gate.md](./platform-readiness-gate.md)
- [market-entry-gate.md](./market-entry-gate.md)
