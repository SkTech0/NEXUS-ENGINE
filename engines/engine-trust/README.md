# Engine Trust

TypeScript (Nx) + Python trust modules.

## Python layout

| Subfolder   | File                 | Description                    |
|------------|----------------------|--------------------------------|
| **identity** | identity_engine.py   | Identity, roles, attributes    |
| **reputation** | reputation_engine.py | Reputation scores, factors   |
| **verification** | verification_engine.py | Verifiers, verify(claim, payload) |
| **security** | trust_score.py       | TrustScore, aggregate, compute |
| **compliance** | compliance_engine.py | Rules, check(subject), violations |
| **audit**   | audit_logger.py      | AuditEntry, log, by_actor/action/resource |

Run from repo root with `PYTHONPATH=engine-trust`:

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=engine-trust
python -c "from identity import create_identity_engine; e = create_identity_engine(); print(e.list_ids())"
```
