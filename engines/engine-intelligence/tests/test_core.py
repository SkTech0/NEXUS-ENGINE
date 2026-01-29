"""Core unit tests for engine-intelligence."""
import pytest
from decision.decision_engine import (
    Option,
    DecisionContext,
    DecisionResult,
    DecisionEngine,
    create_decision_engine,
)
from evaluation.evaluator import (
    EvalSample,
    EvalResult,
    Evaluator,
    accuracy,
    create_evaluator,
)


class TestDecisionEngine:
    def test_create(self):
        e = create_decision_engine()
        assert e is not None

    def test_decide_empty_returns_none(self):
        e = DecisionEngine()
        assert e.decide(DecisionContext(inputs={})) is None

    def test_decide_single_option(self):
        e = create_decision_engine(lambda o, c: 1.0)
        e.add_option(Option("a", None))
        r = e.decide(DecisionContext(inputs={}))
        assert r is not None
        assert r.option_id == "a"
        assert r.score == 1.0

    def test_decide_best_option(self):
        e = create_decision_engine(lambda o, c: 10.0 if o.id == "b" else 5.0)
        e.add_option(Option("a", None))
        e.add_option(Option("b", None))
        r = e.decide(DecisionContext(inputs={}))
        assert r is not None
        assert r.option_id == "b"


class TestEvaluator:
    def test_accuracy_empty(self):
        assert accuracy([]) == 0.0

    def test_accuracy_all_correct(self):
        s = [EvalSample(1, 1), EvalSample(2, 2)]
        assert accuracy(s) == 1.0

    def test_accuracy_half(self):
        s = [EvalSample(1, 1), EvalSample(2, 0)]
        assert accuracy(s) == 0.5

    def test_evaluator_add_evaluate(self):
        ev = create_evaluator()
        ev.add_metric("acc", accuracy)
        samples = [EvalSample(1, 1), EvalSample(0, 0)]
        r = ev.evaluate(samples)
        assert r.get("acc") == 1.0
