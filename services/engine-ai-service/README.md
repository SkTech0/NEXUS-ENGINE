# engine-ai-service

Independent service wrapping engine-ai. Part of NEXUS SEP (Service Extraction Phase).

## Responsibility

- Wraps engine-ai with **real ML models**
- Exposes: `/api/AI/infer`, `/api/AI/models`, `/api/AI/train`, `/health`
- Independent deployment, scaling, failure domain, config, observability

## Models

| Model ID | Purpose | Inputs | Outputs |
|----------|---------|--------|---------|
| `default` | Risk prediction (GradientBoosting) | creditScore, income, loanAmount, debtToIncome, employmentYears | riskScore, confidence |
| `risk` | Same as default | Same | Same |
| `sentiment` | Text sentiment | text or query | sentiment, compound, confidence |

## Local run

```bash
python run.py
# or
uvicorn app.main:app --host 0.0.0.0 --port 5011
```

## Retrain model

```bash
cd services/engine-ai-service && python -m app.models.train
# or from repo root: ./scripts/train-ai-model.sh
```

## Port

Default: 5011 (override via `ENGINE_AI_SERVICE_PORT`).
