"""Flow tests for engine-intelligence."""
import pytest
from decision.decision_engine import create_decision_engine, Option, DecisionContext
from evaluation.evaluator import create_evaluator, EvalSample, accuracy


class TestIntelligenceFlow:
    def test_full_decision_eval_flow(self):
        dec = create_decision_engine(lambda o, c: c.inputs.get("priority", 0) * (o.payload or 1))
        dec.set_options([Option("low", 1), Option("high", 3)])
        ctx = DecisionContext(inputs={"priority": 2})
        r = dec.decide(ctx)
        assert r is not None
        ev = create_evaluator()
        ev.add_metric("acc", accuracy)
        out = ev.evaluate([EvalSample(r.option_id, "high")])
        assert out.metrics["acc"] == 1.0
