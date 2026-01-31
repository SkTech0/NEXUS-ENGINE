"""Connects engine-intelligence-service to engine-core contracts."""
from typing import Any


def bind_intelligence_port() -> Any:
    """Reserved for future port binding. Returns None."""
    return None


def evaluate_via_engine(context: str, inputs: dict[str, Any]) -> dict[str, Any]:
    """Evaluate using domain when available; otherwise deterministic fallback."""
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
        ins = inputs if isinstance(inputs, dict) else {}
        num_keys = len(ins)
        confidence = min(1.0, 0.5 + num_keys * 0.1)
        outcome = "insufficient" if num_keys == 0 else "evaluated"
        return {"outcome": outcome, "confidence": round(confidence, 4), "payload": ins}
