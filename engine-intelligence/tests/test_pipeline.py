"""Pipeline-style tests for engine-intelligence."""
import pytest
from decision.decision_engine import create_decision_engine, Option, DecisionContext
from evaluation.evaluator import create_evaluator, EvalSample, accuracy


class TestIntelligencePipeline:
    def test_decision_then_evaluate_flow(self):
        dec = create_decision_engine(lambda o, c: o.payload or 0)
        dec.add_option(Option("x", 10))
        dec.add_option(Option("y", 5))
        ctx = DecisionContext(inputs={"k": "v"})
        r = dec.decide(ctx)
        assert r is not None
        ev = create_evaluator()
        ev.add_metric("acc", accuracy)
        samples = [EvalSample(r.option_id, "x")]
        res = ev.evaluate(samples)
        assert res.get("acc") == 1.0
