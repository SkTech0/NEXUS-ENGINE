"""Core unit tests for engine-trust."""
import pytest
from security.trust_score import TrustScore, TrustScoreEngine, create_trust_score_engine
from audit.audit_logger import AuditLogger, AuditEntry, create_audit_logger


class TestTrustScore:
    def test_clamp(self):
        ts = TrustScore(1.5, "x")
        c = ts.clamp()
        assert c.value == 1.0
        ts2 = TrustScore(-0.1, "y")
        assert ts2.clamp().value == 0.0


class TestTrustScoreEngine:
    def test_create(self):
        e = create_trust_score_engine()
        assert e is not None

    def test_set_get(self):
        e = create_trust_score_engine()
        e.set_score("e1", TrustScore(0.8, "rep"))
        t = e.get("e1")
        assert t is not None
        assert t.value == 0.8

    def test_compute_default(self):
        e = create_trust_score_engine()
        t = e.compute("new", {})
        assert t.value == 0.0
        assert t.source == "default"


class TestAuditLogger:
    def test_log_and_entries(self):
        log = create_audit_logger()
        log.log("u1", "read", "r1")
        log.log("u1", "write", "r2")
        entries = log.entries()
        assert len(entries) == 2
        assert log.by_actor("u1") == entries
        assert len(log.by_action("write")) == 1
