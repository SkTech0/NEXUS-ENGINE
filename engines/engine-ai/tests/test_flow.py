"""Flow/integration-style tests for engine-ai."""
import pytest
from inference.inference_service import (
    create_inference_service,
    InferenceRequest,
)
from pipelines.ai_pipeline import create_ai_pipeline


class TestAIFlow:
    def test_load_preprocess_infer_flow(self):
        pipe = (
            create_ai_pipeline("flow")
            .add_stage("load", lambda x: {"raw": x})
            .add_stage("preprocess", lambda d: {**d, "normalized": d["raw"] * 2})
            .add_stage("infer", lambda d: {**d, "pred": d["normalized"] + 1})
        )
        out = pipe.run(5)
        assert out["raw"] == 5
        assert out["normalized"] == 10
        assert out["pred"] == 11

    def test_inference_flow_with_mock_model(self):
        svc = create_inference_service()
        svc.set_model_loader(lambda _: "mock")
        svc.set_predict_fn(lambda m, i: {"score": 0.99, "label": "positive"})
        req = InferenceRequest(model_id="mock", inputs={"text": "hello"})
        r = svc.infer(req)
        assert "score" in r.outputs
        assert r.outputs["label"] == "positive"
