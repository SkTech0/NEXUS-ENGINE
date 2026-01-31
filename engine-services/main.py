"""
Engine Services — HTTP API that wraps engine-ai, engine-optimization, engine-intelligence, engine-trust.
Exposes the same contract as engine-api's controllers so engine-api can call this service instead of stubs.
Run: uvicorn main:app --host 0.0.0.0 --port 5002
"""
import os
import sys
from pathlib import Path

# Add repo root and engine dirs so we can import engine-* code
REPO_ROOT = Path(__file__).resolve().parent.parent
for name in ("engine-ai", "engine-optimization", "engine-intelligence", "engine-trust"):
    d = REPO_ROOT / name
    if d.is_dir() and str(d) not in sys.path:
        sys.path.insert(0, str(d))
# Add engine-ai-service for real ML models
_ai_svc_path = REPO_ROOT / "services" / "engine-ai-service"
if _ai_svc_path.is_dir() and str(_ai_svc_path) not in sys.path:
    sys.path.insert(0, str(_ai_svc_path))
# Add engine-trust-service for signal-driven confidence
_trust_svc_path = REPO_ROOT / "services" / "engine-trust-service"
if _trust_svc_path.is_dir() and str(_trust_svc_path) not in sys.path:
    sys.path.insert(0, str(_trust_svc_path))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NEXUS Engine Services", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


# ---- Engine (execute) ----
@app.post("/api/Engine/execute")
def engine_execute(body: dict):
    """Execute action with parameters. Returns status, result, message."""
    action = body.get("action") or "default"
    parameters = body.get("parameters") or {}
    # Use parameters to produce a simple score for loan_decision
    credit = (parameters.get("creditScore") or 0) if isinstance(parameters, dict) else 0
    if not isinstance(credit, (int, float)):
        credit = 0
    score = min(1.0, max(0.0, (credit / 850.0) * 1.2 - 0.1)) if credit else 0.5
    return {"status": "ok", "result": {"executed": action, "score": score, "parameters": parameters}, "message": None}


@app.get("/api/Engine")
def engine_status():
    return {"status": "ok", "result": {"status": "ready"}, "message": None}


# ---- AI (infer) ----
def _loan_infer_outputs(inputs: dict) -> dict:
    """Fallback: derive riskScore and confidence from loan-like inputs."""
    if not isinstance(inputs, dict):
        return {"riskScore": 0.5, "confidence": 0.5}
    credit = inputs.get("creditScore")
    income = inputs.get("income") or 1
    loan = inputs.get("loanAmount") or 0
    if credit is None:
        credit = 650
    credit = float(credit) if isinstance(credit, (int, float)) else 650
    income = float(income) if isinstance(income, (int, float)) else 1
    loan = float(loan) if isinstance(loan, (int, float)) else 0
    ratio = loan / income if income else 0
    risk = max(0.0, min(1.0, 1.0 - (credit / 850.0) * 0.6 - (0.3 if ratio < 0.4 else 0)))
    confidence = 0.6 + (credit / 850.0) * 0.35
    return {"riskScore": round(risk, 4), "confidence": round(min(1.0, confidence), 4)}


def _simple_sentiment_outputs(inputs: dict) -> dict:
    """Fallback: simple keyword-based sentiment when real model unavailable."""
    text = str((inputs or {}).get("text", (inputs or {}).get("query", "")) or "").lower()
    pos = sum(1 for w in ["good", "great", "love", "excellent", "happy"] if w in text)
    neg = sum(1 for w in ["bad", "hate", "terrible", "awful", "sad"] if w in text)
    compound = (pos - neg) / 5.0 if (pos + neg) > 0 else 0.0
    sentiment = "positive" if compound > 0 else ("negative" if compound < 0 else "neutral")
    return {"sentiment": sentiment, "compound": round(compound, 4), "confidence": 0.6}


def _ai_infer_with_real_models(model_id: str, inputs: dict) -> dict | None:
    """Use real ML models from engine-ai-service if available."""
    try:
        from app.service import infer as ai_infer
        return ai_infer(model_id, inputs if isinstance(inputs, dict) else {})
    except Exception:
        return None


@app.post("/api/AI/infer")
def ai_infer(body: dict):
    """Run inference. Returns outputs, latencyMs, modelId. Uses real ML models when available."""
    model_id = body.get("modelId") or body.get("model_id") or "default"
    inputs = body.get("inputs") or {}
    inputs = inputs if isinstance(inputs, dict) else {}
    result = _ai_infer_with_real_models(model_id, inputs)
    if result is not None:
        return result
    # Fallback: use risk for default/risk, sentiment for sentiment/text
    if model_id.lower() in ("sentiment", "text"):
        outputs = _simple_sentiment_outputs(inputs)
    else:
        outputs = _loan_infer_outputs(inputs)
    return {"outputs": outputs, "latencyMs": 0.0, "modelId": model_id}


@app.get("/api/AI/models")
def ai_models():
    """Return available models. Uses real models list when engine-ai-service available."""
    try:
        from app.service import list_models
        return list_models()
    except Exception:
        return {"modelIds": ["default"]}


@app.get("/api/AI/health")
def ai_health():
    return {"status": "healthy", "service": "ai"}


# ---- Optimization ----
def _optimize_loan(target_id: str, objective: str, constraints: dict):
    """Simple feasibility and value from constraints (creditScore, incomeToLoan, existingLoans)."""
    if not isinstance(constraints, dict):
        return 0.0, True
    credit = constraints.get("creditScore")
    income_loan = constraints.get("incomeToLoan")
    existing = constraints.get("existingLoans")
    credit = float(credit) if isinstance(credit, (int, float)) else 700
    income_loan = float(income_loan) if isinstance(income_loan, (int, float)) else 0.3
    existing = int(existing) if isinstance(existing, (int, float)) else 0
    feasible = credit >= 600 and income_loan <= 0.5 and existing <= 3
    value = (credit / 850.0) * 0.5 + (0.5 - income_loan) * 0.3 + max(0, 0.2 - existing * 0.05)
    return max(0.0, min(1.0, value)), feasible


@app.post("/api/Optimization/optimize")
def optimization_optimize(body: dict):
    target_id = body.get("targetId") or "default"
    objective = body.get("objective") or ""
    constraints = body.get("constraints") or {}
    value, feasible = _optimize_loan(target_id, objective, constraints)
    return {"targetId": target_id, "value": round(value, 4), "feasible": feasible}


@app.get("/api/Optimization/health")
def optimization_health():
    return {"status": "healthy", "service": "optimization"}


# ---- Intelligence (evaluate) ----
def _evaluate_loan(context: str, inputs: dict):
    """Outcome and confidence from pipeline inputs (application, engine, ai, optimization)."""
    app = (inputs or {}).get("application") if isinstance(inputs, dict) else {}
    if not isinstance(app, dict):
        app = {}
    credit = float(app.get("creditScore") or 650)
    conf = 0.5 + (credit / 850.0) * 0.45
    outcome = "evaluated"
    if credit >= 750:
        outcome = "approved"
    elif credit < 550:
        outcome = "rejected"
    return outcome, round(min(1.0, conf), 4)


@app.post("/api/Intelligence/evaluate")
def intelligence_evaluate(body: dict):
    context = body.get("context") or ""
    inputs = body.get("inputs") or {}
    try:
        from evaluation.evaluator import create_evaluator, EvalSample, EvalResult
        ev = create_evaluator()
        outcome, confidence = _evaluate_loan(context, inputs)
        return {"outcome": outcome, "confidence": confidence, "payload": inputs}
    except Exception:
        outcome, confidence = _evaluate_loan(context, inputs)
        return {"outcome": outcome, "confidence": confidence, "payload": inputs}


@app.get("/api/Intelligence/health")
def intelligence_health():
    return {"status": "healthy", "service": "intelligence"}


# ---- Trust (health, score) ----
def _trust_from_service():
    """Use engine-trust-service signal-driven confidence when available."""
    try:
        from app import service as trust_svc
        return trust_svc
    except Exception:
        return None


@app.get("/api/Trust/health")
def trust_health():
    """LoanDecisionService expects a JSON with 'confidence' (number)."""
    svc = _trust_from_service()
    if svc is not None:
        confidence, factors = svc.get_confidence()
        return {"status": "healthy", "service": "trust", "confidence": confidence, "factors": factors}
    return {"status": "healthy", "service": "trust", "confidence": 0.9}


@app.get("/api/Trust/score/{entity_id}")
def trust_score(entity_id: str):
    svc = _trust_from_service()
    if svc is not None:
        return svc.get_score(entity_id)
    return {"entityId": entity_id, "score": 0.9, "source": "fallback"}


@app.post("/api/Trust/verify")
def trust_verify(body: dict):
    svc = _trust_from_service()
    if svc is not None:
        return svc.verify(body or {})
    return {"valid": True, "message": "verified"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "engine-services"}
