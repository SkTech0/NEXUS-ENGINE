# Engine AI

Python AI modules (plus existing `engine_ai` package).

## Python layout (root packages)

| Subfolder   | File                 | Description                    |
|------------|----------------------|--------------------------------|
| **models** | model_manager.py     | ModelArtifact, load/save, list |
| **training** | trainer.py         | TrainConfig, TrainResult, train |
| **inference** | inference_service.py | InferenceRequest/Response, infer |
| **pipelines** | ai_pipeline.py    | AIPipeline, add_stage, run     |
| **features** | feature_extractor.py | FeatureSpec, extract         |
| **registry** | model_registry.py   | RegistryEntry, register, get, list_by_tag |

**Run inference service (HTTP on port 8000):**

```bash
cd engine-ai
python3 -m pip install -r requirements.txt
PYTHONPATH=. python3 inference_service.py
```

Or from repo root:

```bash
cd /path/to/NEXUS-ENGINE
python3 -m pip install -r engine-ai/requirements.txt
PYTHONPATH=engine-ai python3 engine-ai/inference_service.py
```

**Use Python modules from repo root** (with `PYTHONPATH=engine-ai`):

```bash
cd /path/to/NEXUS-ENGINE
set PYTHONPATH=engine-ai   # Windows
# export PYTHONPATH=engine-ai   # macOS/Linux
python3 -c "from models import create_model_manager; m = create_model_manager(); print(m.list_models())"
```

Existing package: `engine_ai` (domain, application, inference) remains under `engine_ai/`.
