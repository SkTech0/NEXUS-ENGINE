"""Engine-level tests for engine-intelligence."""
import pytest
from decision.decision_engine import create_decision_engine, Option, DecisionContext


class TestIntelligenceEngine:
    def test_decision_engine_flow(self):
        e = create_decision_engine(lambda o, c: c.inputs.get("score", 0) + (o.payload or 0))
        e.set_options([Option("a", 1), Option("b", 2)])
        r = e.decide(DecisionContext(inputs={"score": 10}))
        assert r is not None
        assert r.option_id == "b"
        assert r.score == 12

    def test_rank(self):
        e = create_decision_engine(lambda o, c: len(o.id))
        e.set_options([Option("a", None), Option("bb", None), Option("c", None)])
        ranked = e.rank(DecisionContext(inputs={}))
        assert len(ranked) == 3
        assert ranked[0][0].id == "bb"
