"""Flow tests for engine-trust."""
import pytest
from security.trust_score import create_trust_score_engine, TrustScore
from audit.audit_logger import create_audit_logger


class TestTrustFlow:
    def test_verify_audit_flow(self):
        engine = create_trust_score_engine()
        audit = create_audit_logger()
        engine.set_score("user1", TrustScore(0.85, "idp"))
        score = engine.get("user1")
        assert score is not None
        audit.log("system", "verify", "user1", {"score": score.value, "source": score.source})
        entries = audit.by_action("verify")
        assert len(entries) == 1
        assert entries[0].details["score"] == 0.85
