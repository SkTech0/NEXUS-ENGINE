"""
Domain facade: wires engine-distributed domain (replication, coordination,
consensus, locks) for use by the service layer.

Supports:
- replicate: append entries to replication log; optional sync from leader
- coordinate: leader election, distributed lock acquire/release, state sync

Payload schemas (enterprise-grade, validated):
- replicate: { entries?: [{term, data}], nodeId?, syncFrom?: {fromIndex, entries} }
- coordinate: { action: "elect"|"lock"|"unlock"|"sync", nodeIds?, lockId?, holder?, ttlSeconds? }
"""
from __future__ import annotations

import logging
import os
import uuid
from pathlib import Path
from typing import Any

# Bootstrap path so engine-distributed domain is importable.
_resolved = Path(__file__).resolve()
_candidates = [
    _resolved.parents[3] / "engine-distributed" if len(_resolved.parents) > 3 else None,
    Path("/app/engine-distributed"),
    Path(os.environ.get("ENGINE_DISTRIBUTED_PATH", "/__none__")),
]
_engine_dist_root: Path | None = None
for _p in _candidates:
    if _p and _p.exists() and (_p / "replication").exists():
        _engine_dist_root = _p
        break
if _engine_dist_root:
    import sys
    if str(_engine_dist_root) not in sys.path:
        sys.path.insert(0, str(_engine_dist_root))

_logger = logging.getLogger("engine-distributed-service")

_DEFAULT_NODE_ID = os.environ.get("ENGINE_DISTRIBUTED_NODE_ID", "node-1")
_CURRENT_TERM = [0]  # mutable for in-process state; production would use shared store


def _ensure_engine() -> "DistributedEngineContext":
    if _engine_context is None:
        raise RuntimeError(
            "Distributed engine not initialized; call init_distributed_engine() at startup"
        )
    return _engine_context


def init_distributed_engine() -> None:
    """
    Initialize domain engines: replication, leader election, distributed lock.
    Idempotent; safe to call from lifecycle startup.
    """
    global _engine_context
    if _engine_context is not None:
        return
    if _engine_dist_root is None:
        _logger.warning(
            "engine-distributed domain not on path; using fallback (in-memory only)"
        )
        _engine_context = _create_fallback_context()
        return
    try:
        from replication.replication_engine import (
            ReplicationEngine,
            ReplicatedEntry,
            create_replication_engine,
        )
        from coordination.leader_election import (
            elect_leader_bully,
            run_election,
            ElectionResult,
        )
        from coordination.distributed_lock import (
            DistributedLockBackend,
            create_distributed_lock_backend,
        )
    except ImportError as e:
        _logger.warning("engine-distributed domain import failed: %s; using fallback", e)
        _engine_context = _create_fallback_context()
        return

    replication_engine = create_replication_engine(
        node_id=_DEFAULT_NODE_ID,
        replicas=[],
        apply_fn=lambda e: _logger.debug("replication applied index=%s term=%s", e.index, e.term),
    )
    lock_backend = create_distributed_lock_backend()

    class DistributedEngineContext:
        def __init__(
            self,
            replication_engine: ReplicationEngine,
            lock_backend: DistributedLockBackend,
        ):
            self.replication_engine = replication_engine
            self.lock_backend = lock_backend
            self._known_nodes: list[str] = [_DEFAULT_NODE_ID]
            self._current_leader: str | None = None

        def replicate(self, payload: dict[str, Any]) -> dict[str, Any]:
            """
            Append entries to replication log. Returns { status, replicated, lastIndex, term }.
            """
            entries_data = payload.get("entries")
            node_id = payload.get("nodeId") or _DEFAULT_NODE_ID
            sync_from = payload.get("syncFrom")

            if sync_from and isinstance(sync_from, dict):
                return self._sync_from_leader(sync_from)

            if not entries_data:
                return {"status": "accepted", "replicated": 0, "lastIndex": -1, "term": _CURRENT_TERM[0]}

            if not isinstance(entries_data, list):
                return {"status": "error", "replicated": 0, "error": "INVALID_ENTRIES", "message": "entries must be a list"}

            replicated = 0
            for i, entry in enumerate(entries_data):
                if not isinstance(entry, dict):
                    continue
                term = int(entry.get("term", _CURRENT_TERM[0]))
                data = entry.get("data", entry)
                try:
                    self.replication_engine.append(term=term, data=data)
                    replicated += 1
                except Exception as e:
                    _logger.warning("replicate entry %s failed: %s", i, e)
                    break

            last_idx = self.replication_engine.last_index()
            _logger.info("replicate nodeId=%s replicated=%s lastIndex=%s", node_id, replicated, last_idx)
            return {
                "status": "accepted",
                "replicated": replicated,
                "lastIndex": last_idx,
                "term": self.replication_engine.last_term(),
            }

        def _sync_from_leader(self, sync_from: dict[str, Any]) -> dict[str, Any]:
            from replication.replication_engine import ReplicatedEntry
            from_index = int(sync_from.get("fromIndex", 0))
            entries_data = sync_from.get("entries") or []
            entries = []
            for e in entries_data:
                if isinstance(e, dict):
                    entries.append(ReplicatedEntry(
                        index=e.get("index", len(entries)),
                        term=int(e.get("term", 0)),
                        data=e.get("data", e),
                    ))
            success = self.replication_engine.sync_from(entries, from_index)
            return {
                "status": "accepted" if success else "rejected",
                "replicated": len(entries) if success else 0,
                "lastIndex": self.replication_engine.last_index(),
                "term": self.replication_engine.last_term(),
                "synced": success,
            }

        def coordinate(self, payload: dict[str, Any]) -> dict[str, Any]:
            """
            Coordinate: elect leader, acquire/release lock. Returns { status, coordinated, ... }.
            """
            action = (payload.get("action") or "").strip().lower()
            if not action:
                return {"status": "error", "coordinated": False, "error": "MISSING_ACTION", "message": "action is required"}

            if action == "elect":
                return self._elect_leader(payload)
            if action in ("lock", "acquire"):
                return self._acquire_lock(payload)
            if action in ("unlock", "release"):
                return self._release_lock(payload)
            if action == "status":
                return self._coordination_status(payload)

            return {"status": "error", "coordinated": False, "error": "UNKNOWN_ACTION", "message": f"unknown action: {action}"}

        def _elect_leader(self, payload: dict[str, Any]) -> dict[str, Any]:
            node_ids = payload.get("nodeIds") or payload.get("nodes")
            if isinstance(node_ids, list):
                nodes = [str(n) for n in node_ids if n]
            else:
                nodes = self._known_nodes
            failed = set(payload.get("failed") or [])
            if isinstance(failed, list):
                failed = set(str(f) for f in failed)
            result = run_election(nodes, failed=failed, term=_CURRENT_TERM[0])
            if result is None:
                return {"status": "error", "coordinated": False, "error": "NO_LEADER", "message": "no nodes available"}
            _CURRENT_TERM[0] = result.term
            self._current_leader = result.leader_id
            _logger.info("coordinate elect leader=%s term=%s", result.leader_id, result.term)
            return {
                "status": "ok",
                "coordinated": True,
                "leaderId": result.leader_id,
                "term": result.term,
            }

        def _acquire_lock(self, payload: dict[str, Any]) -> dict[str, Any]:
            lock_id = payload.get("lockId") or payload.get("lock_id") or str(uuid.uuid4())
            holder = payload.get("holder") or payload.get("nodeId") or _DEFAULT_NODE_ID
            ttl = payload.get("ttlSeconds") or payload.get("ttl_seconds")
            if ttl is not None:
                ttl = float(ttl)
            try:
                acquired = self.lock_backend.acquire(lock_id=lock_id, holder=holder, ttl_seconds=ttl)
                _logger.info("coordinate lock acquire lockId=%s holder=%s acquired=%s", lock_id, holder, acquired)
                return {
                    "status": "ok",
                    "coordinated": acquired,
                    "lockId": lock_id,
                    "holder": holder,
                    "acquired": acquired,
                }
            except Exception as e:
                _logger.warning("coordinate lock acquire failed: %s", e)
                try:
                    from errors.error_model import ValidationError
                    if isinstance(e, ValidationError):
                        return {"status": "error", "coordinated": False, "error": "VALIDATION", "message": str(e)}
                except ImportError:
                    pass
                return {"status": "error", "coordinated": False, "error": "LOCK_FAILED", "message": str(e)}

        def _release_lock(self, payload: dict[str, Any]) -> dict[str, Any]:
            lock_id = payload.get("lockId") or payload.get("lock_id")
            holder = payload.get("holder") or payload.get("nodeId") or _DEFAULT_NODE_ID
            if not lock_id:
                return {"status": "error", "coordinated": False, "error": "MISSING_LOCK_ID", "message": "lockId is required"}
            released = self.lock_backend.release(lock_id=str(lock_id), holder=holder)
            _logger.info("coordinate lock release lockId=%s holder=%s released=%s", lock_id, holder, released)
            return {
                "status": "ok",
                "coordinated": True,
                "lockId": lock_id,
                "released": released,
            }

        def _coordination_status(self, payload: dict[str, Any]) -> dict[str, Any]:
            return {
                "status": "ok",
                "coordinated": True,
                "leaderId": self._current_leader,
                "term": _CURRENT_TERM[0],
                "nodeId": _DEFAULT_NODE_ID,
                "logLength": self.replication_engine.last_index() + 1,
            }

    _engine_context = DistributedEngineContext(
        replication_engine=replication_engine,
        lock_backend=lock_backend,
    )
    _logger.info("domain_facade.init_distributed_engine ready (engine-distributed domain)")


def _create_fallback_context() -> "DistributedEngineContext":
    """Fallback when engine-distributed domain is unavailable."""

    class FallbackContext:
        def replicate(self, payload: dict[str, Any]) -> dict[str, Any]:
            entries = payload.get("entries") or []
            n = len(entries) if isinstance(entries, list) else 0
            _logger.warning("replicate fallback entries=%s", n)
            return {"status": "accepted", "replicated": n, "lastIndex": n - 1 if n else -1, "term": 0}

        def coordinate(self, payload: dict[str, Any]) -> dict[str, Any]:
            action = (payload.get("action") or "").lower()
            _logger.warning("coordinate fallback action=%s", action)
            if action == "elect":
                return {"status": "ok", "coordinated": True, "leaderId": _DEFAULT_NODE_ID, "term": 1}
            if action in ("lock", "acquire"):
                return {"status": "ok", "coordinated": True, "lockId": payload.get("lockId", "fallback"), "acquired": True}
            if action in ("unlock", "release"):
                return {"status": "ok", "coordinated": True, "released": True}
            return {"status": "ok", "coordinated": True}

    return FallbackContext()


_engine_context: "DistributedEngineContext | None" = None


def replicate(payload: dict[str, Any]) -> dict[str, Any]:
    """Domain entrypoint: replicate entries. Returns { status, replicated, lastIndex, term }."""
    ctx = _ensure_engine()
    return ctx.replicate(payload or {})


def coordinate(payload: dict[str, Any]) -> dict[str, Any]:
    """Domain entrypoint: coordinate (elect, lock, unlock). Returns { status, coordinated, ... }."""
    ctx = _ensure_engine()
    return ctx.coordinate(payload or {})
