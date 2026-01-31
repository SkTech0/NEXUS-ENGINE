"""Adapter layer for engine-intelligence-service."""
from typing import Any


def evaluate(context: str, inputs: dict[str, Any]) -> dict[str, Any]:
    """
    Evaluate context + inputs using engine-intelligence domain.
    Returns outcome, confidence, payload. Optional: reasoning, signals.
    """
    try:
        from evaluation.request_evaluator import evaluate_request

        result = evaluate_request(context, inputs if isinstance(inputs, dict) else {})
        out: dict[str, Any] = {
            "outcome": result.outcome,
            "confidence": result.confidence,
            "payload": result.payload,
        }
        if result.reasoning:
            out["reasoning"] = result.reasoning
        if result.signals:
            out["signals"] = result.signals
        return out
    except Exception:
        # Fallback: minimal deterministic response when domain unavailable
        ins = inputs if isinstance(inputs, dict) else {}
        num_keys = len(ins)
        confidence = min(1.0, 0.5 + num_keys * 0.1)
        outcome = "insufficient" if num_keys == 0 else "evaluated"
        return {"outcome": outcome, "confidence": round(confidence, 4), "payload": ins}


def execute(action: str, parameters: dict[str, Any]) -> dict[str, Any]:
    return {"status": "ok", "result": {"executed": action, "parameters": parameters}, "message": None}
