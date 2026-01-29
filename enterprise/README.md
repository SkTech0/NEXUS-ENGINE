# Enterprise Layer

Compliance, governance, SLA, enterprise auth, and policy.

## Files

| File | Purpose |
|------|--------|
| **compliance_engine.py** | ComplianceEngine — add_rule, check(subject) → ComplianceResult with violations |
| **governance_engine.py** | GovernanceEngine — add_policy, evaluate(subject); create_approval, approve, reject |
| **sla_manager.py** | SLAManager — create, get, list_for_tenant; check(sla_id, current_metrics) → SLAStatus |
| **enterprise_auth.py** | EnterpriseAuth — set_validator, verify(token); org hierarchy (add_org, get_ancestors) |
| **policy_engine.py** | PolicyEngine — add_policy, evaluate(context) → PolicyResult (allow/deny) |

## Usage

From repo root with `PYTHONPATH=enterprise` (or parent of enterprise):

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=.
python -c "from enterprise import create_compliance_engine; e = create_compliance_engine(); print(e.check({}))"
```
