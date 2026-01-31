"""
Request evaluator — evaluate context + inputs → outcome + confidence.
Product-neutral, deterministic, uses engine-intelligence domain modules.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from decision.decision_engine import DecisionContext, Option, create_decision_engine

_logger = logging.getLogger("engine-intelligence")


# Outcome options for the decision engine (product-neutral)
OUTCOME_INSUFFICIENT = "insufficient"
OUTCOME_EVALUATED = "evaluated"
OUTCOME_STRONG = "strong"

# Evidence thresholds (deterministic, no domain rules)
EVIDENCE_LOW = 0.4
EVIDENCE_HIGH = 0.8

# Confidence base and caps
CONFIDENCE_BASE = 0.5
CONFIDENCE_MIN = 0.0
CONFIDENCE_MAX = 1.0


def _collect_numerics(obj: Any, depth: int, max_depth: int) -> list[float]:
    """Recursively collect numeric values from dict/iterables. Bounded depth."""
    if depth > max_depth:
        return []
    out: list[float] = []
    if isinstance(obj, bool):
        return []
    if isinstance(obj, (int, float)):
        v = float(obj)
        if v == v:  # not nan
            out.append(v)
    elif isinstance(obj, dict):
        for v in obj.values():
            out.extend(_collect_numerics(v, depth + 1, max_depth))
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            out.extend(_collect_numerics(v, depth + 1, max_depth))
    return out


def _count_nested(obj: Any, depth: int, max_depth: int) -> int:
    """Count nested dicts (direct dict children + their nested). Bounded depth."""
    if depth > max_depth:
        return 0
    if isinstance(obj, dict):
        direct = sum(1 for v in obj.values() if isinstance(v, dict))
        recursive = sum(_count_nested(v, depth + 1, max_depth) for v in obj.values() if isinstance(v, dict))
        return direct + recursive
    if isinstance(obj, (list, tuple)):
        return sum(_count_nested(v, depth + 1, max_depth) for v in obj)
    return 0


@dataclass
class Evidence:
    """Evidence extracted from inputs (product-neutral)."""

    num_keys: int = 0
    numeric_count: int = 0
    nested_count: int = 0
    numeric_sum: float = 0.0

    def to_signals(self) -> dict[str, Any]:
        return {
            "num_keys": self.num_keys,
            "numeric_count": self.numeric_count,
            "nested_count": self.nested_count,
            "numeric_sum": round(self.numeric_sum, 4),
        }


def extract_evidence(inputs: dict[str, Any]) -> Evidence:
    """
    Extract product-neutral evidence from inputs.
    No domain rules; purely structural.
    """
    if not isinstance(inputs, dict):
        return Evidence()
    num_keys = len(inputs)
    numerics = _collect_numerics(inputs, 0, 3)
    nested_count = _count_nested(inputs, 0, 3)
    return Evidence(
        num_keys=num_keys,
        numeric_count=len(numerics),
        nested_count=nested_count,
        numeric_sum=sum(numerics),
    )


def evidence_to_confidence(evidence: Evidence) -> float:
    """
    Deterministic confidence from evidence strength.
    Base 0.5; scales to 1.0 with structure, numerics, nesting.
    """
    # Structure: more keys = more evidence (cap at 5 keys → 0.15)
    structure_factor = min(1.0, evidence.num_keys / 5.0) * 0.15
    # Numerics: more numbers = more evidence (cap at 4 → 0.2)
    numeric_factor = min(1.0, evidence.numeric_count / 4.0) * 0.2
    # Nesting: nested objects indicate richer payload (cap at 3 → 0.15)
    nested_factor = min(1.0, evidence.nested_count / 3.0) * 0.15
    raw = CONFIDENCE_BASE + structure_factor + numeric_factor + nested_factor
    return round(max(CONFIDENCE_MIN, min(CONFIDENCE_MAX, raw)), 4)


def _outcome_scorer(opt: Option, ctx: DecisionContext) -> float:
    """
    Score each outcome option by evidence support.
    insufficient: favored when evidence < EVIDENCE_LOW
    evaluated: favored when EVIDENCE_LOW <= evidence < EVIDENCE_HIGH
    strong: favored when evidence >= EVIDENCE_HIGH
    """
    evidence = extract_evidence(ctx.inputs)
    confidence = evidence_to_confidence(evidence)
    if opt.id == OUTCOME_INSUFFICIENT:
        return 1.0 - confidence if confidence < EVIDENCE_LOW else 0.0
    if opt.id == OUTCOME_EVALUATED:
        if EVIDENCE_LOW <= confidence < EVIDENCE_HIGH:
            return confidence
        if confidence < EVIDENCE_LOW:
            return confidence * 0.5
        return 0.5
    if opt.id == OUTCOME_STRONG:
        return confidence if confidence >= EVIDENCE_HIGH else 0.0
    return 0.0


def _create_request_engine():
    """Create decision engine for request evaluation."""
    engine = create_decision_engine(scorer=_outcome_scorer)
    engine.set_options([
        Option(OUTCOME_INSUFFICIENT),
        Option(OUTCOME_EVALUATED),
        Option(OUTCOME_STRONG),
    ])
    return engine


_REQUEST_ENGINE = _create_request_engine()


@dataclass
class EvaluationResult:
    """Result of evaluate_request."""

    outcome: str
    confidence: float
    payload: dict[str, Any]
    reasoning: str = ""
    signals: dict[str, Any] = field(default_factory=dict)


def evaluate_request(context: str, inputs: dict[str, Any]) -> EvaluationResult:
    """
    Evaluate context + inputs → outcome + confidence.
    Product-neutral, deterministic, stateless.

    Args:
        context: Evaluation context (informational; may influence future weighting).
        inputs: Structured inputs (dict). Evidence is extracted generically.

    Returns:
        EvaluationResult with outcome, confidence, payload, optional reasoning/signals.
    """
    # Input validation
    if not isinstance(context, str):
        context = str(context) if context is not None else ""
    if not isinstance(inputs, dict):
        inputs = {}

    evidence = extract_evidence(inputs)
    confidence = evidence_to_confidence(evidence)
    ctx = DecisionContext(inputs=inputs, metadata={"context": context})

    result = _REQUEST_ENGINE.decide(ctx)
    outcome = result.option_id if result else OUTCOME_EVALUATED
    # Confidence is always evidence-based (how strong the inputs are), not option score
    confidence = evidence_to_confidence(evidence)

    # Ensure we return a valid outcome from our option set
    if outcome not in (OUTCOME_INSUFFICIENT, OUTCOME_EVALUATED, OUTCOME_STRONG):
        outcome = OUTCOME_EVALUATED

    reasoning = f"evidence_keys={evidence.num_keys} numerics={evidence.numeric_count} nested={evidence.nested_count}"
    signals = evidence.to_signals()
    signals["outcome_option"] = outcome
    signals["confidence_raw"] = confidence

    _logger.debug(
        "request_evaluator.evaluate context=%s outcome=%s confidence=%s",
        context[:50] if context else "(empty)",
        outcome,
        confidence,
    )

    return EvaluationResult(
        outcome=outcome,
        confidence=confidence,
        payload=dict(inputs),
        reasoning=reasoning,
        signals=signals,
    )
