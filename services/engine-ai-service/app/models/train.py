#!/usr/bin/env python3
"""
Train and persist the risk prediction model.
Run from engine-ai-service dir: python -m app.models.train
Or: cd services/engine-ai-service && python -m app.models.train
"""
from pathlib import Path

import numpy as np
from joblib import dump
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler


def generate_synthetic_data(n_samples: int = 5000, seed: int = 42) -> tuple[np.ndarray, np.ndarray]:
    """Generate synthetic loan application data for training."""
    rng = np.random.default_rng(seed)
    credit_score = rng.integers(300, 850, size=n_samples).astype(float)
    income = rng.exponential(50000, size=n_samples) + 20000
    loan_amount = rng.uniform(5000, 500000, size=n_samples)
    debt_to_income = rng.uniform(0.1, 0.8, size=n_samples)
    employment_years = rng.uniform(0, 30, size=n_samples)

    # Feature engineering
    X = np.column_stack([
        credit_score / 850.0,  # Normalized credit
        np.log1p(income) / 15.0,  # Log income scaled
        loan_amount / np.maximum(income, 1),  # Loan-to-income ratio
        debt_to_income,
        employment_years / 30.0,
    ])

    # Risk: lower credit + higher DTI + higher loan/income = higher risk
    risk_base = 1.0 - (credit_score / 850.0) * 0.5
    risk_base += debt_to_income * 0.3
    risk_base += np.clip(loan_amount / np.maximum(income, 1), 0, 2) * 0.2
    risk_base -= employment_years / 30.0 * 0.1
    risk = np.clip(risk_base + rng.normal(0, 0.05, n_samples), 0.0, 1.0)

    return X, risk


def train_and_save(output_dir: Path | None = None) -> Path:
    """Train model and save to joblib. Returns path to saved model."""
    if output_dir is None:
        output_dir = Path(__file__).resolve().parent

    X, y = generate_synthetic_data()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = GradientBoostingRegressor(n_estimators=50, max_depth=4, random_state=42)
    model.fit(X_scaled, y)

    model_path = output_dir / "risk_model.joblib"
    dump({"model": model, "scaler": scaler}, model_path)
    return model_path


if __name__ == "__main__":
    path = train_and_save()
    print(f"Model saved to {path}")
