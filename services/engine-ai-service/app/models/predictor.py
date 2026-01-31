"""
Real ML predictor: loads trained model and runs inference.
Supports 'default' (risk) and 'sentiment' models.
"""
from pathlib import Path
from typing import Any

import numpy as np


def _extract_features(inputs: dict[str, Any]) -> np.ndarray:
    """Extract feature vector from inputs for risk model."""
    credit = float(inputs.get("creditScore", inputs.get("credit_score", 650)))
    income = float(inputs.get("income", inputs.get("annualIncome", 50000)))
    loan = float(inputs.get("loanAmount", inputs.get("loan_amount", 100000)))
    dti = float(inputs.get("debtToIncome", inputs.get("debt_to_income", 0.3)))
    employment = float(inputs.get("employmentYears", inputs.get("employment_years", 5)))

    income = max(income, 1.0)
    return np.array([[
        credit / 850.0,
        np.log1p(income) / 15.0,
        loan / income,
        dti,
        employment / 30.0,
    ]])


class RiskPredictor:
    """Loads and runs the risk prediction model."""

    def __init__(self) -> None:
        self._model = None
        self._scaler = None
        self._loaded = False

    def _load(self) -> None:
        if self._loaded:
            return
        model_path = Path(__file__).resolve().parent / "risk_model.joblib"
        if model_path.exists():
            from joblib import load
            data = load(model_path)
            self._model = data["model"]
            self._scaler = data["scaler"]
        self._loaded = True

    def predict(self, inputs: dict[str, Any]) -> dict[str, Any]:
        """Run risk prediction. Returns riskScore and confidence."""
        self._load()
        if self._model is None or self._scaler is None:
            # Fallback when model file missing (e.g. first deploy before train)
            return _fallback_risk(inputs)

        try:
            X = _extract_features(inputs)
            X_scaled = self._scaler.transform(X)
            risk = float(self._model.predict(X_scaled)[0])
            risk = max(0.0, min(1.0, risk))
            confidence = 0.7 + (1.0 - abs(risk - 0.5) * 2) * 0.25  # Higher when extreme
            return {
                "riskScore": round(risk, 4),
                "confidence": round(confidence, 4),
                "modelVersion": "1.0",
            }
        except Exception:
            return _fallback_risk(inputs)


def _fallback_risk(inputs: dict[str, Any]) -> dict[str, Any]:
    """Rule-based fallback when model unavailable."""
    credit = float(inputs.get("creditScore", inputs.get("credit_score", 650)))
    income = float(inputs.get("income", 50000)) or 1.0
    loan = float(inputs.get("loanAmount", 100000)) or 0.0
    ratio = loan / income
    risk = max(0.0, min(1.0, 1.0 - (credit / 850.0) * 0.6 - (0.3 if ratio < 0.4 else 0)))
    confidence = 0.6 + (credit / 850.0) * 0.35
    return {"riskScore": round(risk, 4), "confidence": round(min(1.0, confidence), 4)}


def _sentiment_predict(inputs: dict[str, Any]) -> dict[str, Any]:
    """Sentiment analysis - rule-based for minimal deps, or VADER if available."""
    try:
        from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
        analyzer = SentimentIntensityAnalyzer()
        text = str(inputs.get("text", inputs.get("query", "")) or "")
        scores = analyzer.polarity_scores(text)
        compound = scores["compound"]
        sentiment = "positive" if compound >= 0.05 else ("negative" if compound <= -0.05 else "neutral")
        confidence = min(1.0, abs(compound) * 2) if compound != 0 else 0.5
        return {
            "sentiment": sentiment,
            "compound": round(compound, 4),
            "confidence": round(confidence, 4),
            "scores": {k: round(v, 4) for k, v in scores.items()},
        }
    except ImportError:
        return _simple_sentiment(inputs)


def _simple_sentiment(inputs: dict[str, Any]) -> dict[str, Any]:
    """Keyword-based sentiment when vaderSentiment not installed."""
    text = str(inputs.get("text", inputs.get("query", ""))).lower()
    pos = sum(1 for w in ["good", "great", "love", "excellent", "happy"] if w in text)
    neg = sum(1 for w in ["bad", "hate", "terrible", "awful", "sad"] if w in text)
    compound = (pos - neg) / 5.0 if (pos + neg) > 0 else 0.0
    sentiment = "positive" if compound > 0 else ("negative" if compound < 0 else "neutral")
    return {"sentiment": sentiment, "compound": compound, "confidence": 0.6}


_risk_predictor: RiskPredictor | None = None
_sentiment_analyzer = None


def create_predictor() -> RiskPredictor:
    """Singleton risk predictor."""
    global _risk_predictor
    if _risk_predictor is None:
        _risk_predictor = RiskPredictor()
    return _risk_predictor


def infer_with_model(model_id: str, inputs: dict[str, Any]) -> dict[str, Any]:
    """Route to appropriate model and return outputs."""
    if model_id in ("sentiment", "text"):
        return _sentiment_predict(inputs)
    # default, risk, or any other id
    return create_predictor().predict(inputs)
