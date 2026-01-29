"""Pipeline-style tests for engine-trust."""
import pytest
from security.trust_score import create_trust_score_engine, TrustScore
from audit.audit_logger import create_audit_logger


class TestTrustPipeline:
    def test_score_then_audit_flow(self):
        engine = create_trust_score_engine()
        engine.set_score("e1", TrustScore(0.9, "rep"))
        audit = create_audit_logger()
        score = engine.get("e1")
        assert score is not None
        audit.log("system", "score_check", "e1", {"value": score.value})
        assert len(audit.by_action("score_check")) == 1
