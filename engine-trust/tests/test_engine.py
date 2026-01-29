"""Engine-level tests for engine-trust."""
import pytest
from security.trust_score import create_trust_score_engine, TrustScore
from audit.audit_logger import create_audit_logger


class TestTrustEngine:
    def test_trust_engine_aggregate(self):
        e = create_trust_score_engine()
        e.set_aggregator(lambda scores: sum(s.value for s in scores) / len(scores) if scores else 0.0)
        e.add_score("e1", TrustScore(0.6, "a"))
        e.set_score("e1", TrustScore(0.8, "b"))
        t = e.get("e1")
        assert t is not None
        assert 0 <= t.value <= 1
        assert t.source == "b"

    def test_audit_engine_flow(self):
        audit = create_audit_logger()
        audit.log("u1", "login", "")
        audit.log("u1", "access", "resource")
        by_actor = audit.by_actor("u1")
        assert len(by_actor) == 2
        assert audit.by_resource("resource")[0].action == "access"
