"""Integration tests for engine-distributed-service domain facade."""
import sys
from pathlib import Path

_service_dir = Path(__file__).resolve().parents[1]
_root = _service_dir.parents[1]
if str(_service_dir) not in sys.path:
    sys.path.insert(0, str(_service_dir))
_engine_dist = _root / "engine-distributed"
if _engine_dist.exists() and str(_engine_dist) not in sys.path:
    sys.path.insert(0, str(_engine_dist))

import pytest


class TestReplicateFacade:
    """Test domain_facade replicate()."""

    def test_replicate_entries(self):
        from app.domain_facade import init_distributed_engine, replicate
        init_distributed_engine()
        result = replicate({
            "entries": [{"term": 1, "data": {"k": "v1"}}, {"term": 1, "data": {"k": "v2"}}],
        })
        assert result["status"] == "accepted"
        assert result["replicated"] == 2
        assert result["lastIndex"] >= 1

    def test_replicate_empty_returns_accepted(self):
        from app.domain_facade import init_distributed_engine, replicate
        init_distributed_engine()
        result = replicate({})
        assert result["status"] == "accepted"
        assert result["replicated"] == 0


class TestCoordinateFacade:
    """Test domain_facade coordinate()."""

    def test_elect_leader(self):
        from app.domain_facade import init_distributed_engine, coordinate
        init_distributed_engine()
        result = coordinate({
            "action": "elect",
            "nodeIds": ["node-a", "node-b", "node-c"],
        })
        assert result["status"] == "ok"
        assert result["coordinated"] is True
        assert result["leaderId"] == "node-c"  # bully: max id
        assert result["term"] >= 1

    def test_lock_acquire_release(self):
        from app.domain_facade import init_distributed_engine, coordinate
        init_distributed_engine()
        acq = coordinate({"action": "lock", "lockId": "test-lock-1", "holder": "node-1"})
        assert acq["status"] == "ok"
        assert acq["acquired"] is True
        rel = coordinate({"action": "unlock", "lockId": "test-lock-1", "holder": "node-1"})
        assert rel["status"] == "ok"
        assert rel["released"] is True
