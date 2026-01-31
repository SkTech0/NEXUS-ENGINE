# Enterprise Layer (Phase 13 — Enterprise readiness)

Compliance, governance, SLA, enterprise auth, and policy.

## Files

| File | Purpose |
|------|--------|
| **compliance_engine.py** | ComplianceEngine — add_rule, check(subject) → ComplianceResult with violations |
| **governance_engine.py** | GovernanceEngine — add_policy, evaluate(subject); create_approval, approve, reject |
| **sla_manager.py** | SLAManager — create, get, list_for_tenant; check(sla_id, current_metrics) → SLAStatus |
| **enterprise_auth.py** | EnterpriseAuth — set_validator, verify(token); org hierarchy (add_org, get_ancestors) |
| **policy_engine.py** | PolicyEngine — add_policy, evaluate(context) → PolicyResult (allow/deny) |

Compliance is canonical at `enterprise/compliance_engine.py`; `enterprise/compliance/` re-exports for subpackage use.

## Usage

From repo root with `PYTHONPATH=.`:

```bash
cd NEXUS-ENGINE
set PYTHONPATH=.
python -c "from enterprise import create_compliance_engine; e = create_compliance_engine(); print(e.check({}))"
```
