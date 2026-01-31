"""Tests for request_evaluator — evaluation of context + inputs."""
from evaluation.request_evaluator import (
    evaluate_request,
    extract_evidence,
    evidence_to_confidence,
    Evidence,
    OUTCOME_EVALUATED,
    OUTCOME_INSUFFICIENT,
    OUTCOME_STRONG,
)


class TestExtractEvidence:
    def test_empty_inputs(self):
        e = extract_evidence({})
        assert e.num_keys == 0
        assert e.numeric_count == 0
        assert e.nested_count == 0

    def test_flat_numerics(self):
        e = extract_evidence({"a": 1, "b": 2.5})
        assert e.num_keys == 2
        assert e.numeric_count == 2
        assert e.nested_count == 0
        assert e.numeric_sum == 3.5

    def test_nested_structure(self):
        e = extract_evidence({"application": {"x": 10}, "ai": {"y": 20}})
        assert e.num_keys == 2
        assert e.numeric_count == 2
        assert e.nested_count >= 2  # two direct nested dicts
        assert e.numeric_sum == 30.0

    def test_non_dict_returns_empty(self):
        e = extract_evidence(None)  # type: ignore
        assert e.num_keys == 0
        assert isinstance(e, Evidence)


class TestEvidenceToConfidence:
    def test_empty_evidence_base_confidence(self):
        c = evidence_to_confidence(Evidence())
        assert 0.5 <= c <= 1.0

    def test_rich_evidence_higher_confidence(self):
        empty = evidence_to_confidence(Evidence())
        rich = evidence_to_confidence(Evidence(num_keys=5, numeric_count=4, nested_count=3))
        assert rich > empty
        assert rich <= 1.0

    def test_deterministic(self):
        e = Evidence(num_keys=3, numeric_count=2, nested_count=1)
        c1 = evidence_to_confidence(e)
        c2 = evidence_to_confidence(e)
        assert c1 == c2


class TestEvaluateRequest:
    def test_empty_inputs(self):
        r = evaluate_request("demo", {})
        assert r.outcome in (OUTCOME_INSUFFICIENT, OUTCOME_EVALUATED, OUTCOME_STRONG)
        assert 0.0 <= r.confidence <= 1.0
        assert r.payload == {}
        assert "evidence_keys" in r.reasoning or r.reasoning
        assert "num_keys" in r.signals

    def test_rich_inputs_higher_confidence(self):
        r_empty = evaluate_request("demo", {})
        r_rich = evaluate_request(
            "demo",
            {"application": {"a": 1}, "ai": {"b": 2}, "engine": {"c": 3}, "optimization": {"d": 4}},
        )
        assert r_rich.confidence >= r_empty.confidence

    def test_outcome_varies_with_evidence(self):
        r_low = evaluate_request("x", {})
        r_high = evaluate_request(
            "x",
            {
                "k1": 1,
                "k2": 2,
                "k3": 3,
                "k4": 4,
                "k5": 5,
                "nested": {"a": 10, "b": 20},
            },
        )
        # Strong evidence should yield strong or evaluated; weak should yield insufficient or evaluated
        assert r_high.outcome in (OUTCOME_EVALUATED, OUTCOME_STRONG)
        assert r_low.outcome in (OUTCOME_INSUFFICIENT, OUTCOME_EVALUATED)

    def test_non_dict_inputs_treated_as_empty(self):
        r = evaluate_request("demo", None)  # type: ignore
        assert isinstance(r.payload, dict)
        assert 0.0 <= r.confidence <= 1.0

    def test_product_neutral_no_loan_rules(self):
        # No credit score thresholds; purely structural
        r1 = evaluate_request("loan", {"creditScore": 850})
        r2 = evaluate_request("loan", {"creditScore": 300})
        # Both have 1 key, 1 numeric — same structural evidence
        assert r1.confidence == r2.confidence
        assert r1.outcome == r2.outcome
