#!/bin/sh
# Train the AI risk model and save to engine-ai-service.
# Run from repo root: ./scripts/train-ai-model.sh
set -e
cd "$(dirname "$0")/.."
cd services/engine-ai-service
pip install -q scikit-learn joblib 2>/dev/null || true
python -m app.models.train
echo "Done. Model at: services/engine-ai-service/app/models/risk_model.joblib"
