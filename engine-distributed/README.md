# Engine Distributed

TypeScript (Nx) + Python distributed systems modules.

## Python modules

Run from repo root with `PYTHONPATH=engine-distributed`:

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=engine-distributed
python -c "from consensus.paxos import run_propose, AcceptorState; print(run_propose(1, 0, [AcceptorState() for _ in range(3)]))"
```

Or run tests:

```bash
pip install pytest
pytest engine-distributed --pyargs -v
```

### Layout

| Subfolder     | Files                 | Description                    |
|---------------|-----------------------|--------------------------------|
| **consensus** | `paxos.py`, `raft.py` | Paxos and Raft                 |
| **clocks**    | `vector_clock.py`, `logical_clock.py` | Vector and Lamport clocks |
| **replication** | `replication_engine.py` | Log replication            |
| **coordination** | `leader_election.py`, `distributed_lock.py` | Leader election, locks |
| **messaging** | `message_bus.py`      | Pub/sub message bus           |
| **state**     | `distributed_state.py`| Versioned distributed state   |

All modules are modular and testable (pure functions or small classes).
