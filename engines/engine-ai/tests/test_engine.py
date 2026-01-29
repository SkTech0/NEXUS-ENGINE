"""Engine-level tests for engine-ai."""
import pytest
from inference.inference_service import InferenceService, InferenceRequest, create_inference_service
from pipelines.ai_pipeline import create_ai_pipeline


class TestEngineAI:
    def test_inference_engine_flow(self):
        svc = create_inference_service()
        svc.set_model_loader(lambda _: None)
        svc.set_predict_fn(lambda m, i: {"result": sum(i.values()) if i else 0})
        req = InferenceRequest(model_id="default", inputs={"a": 1, "b": 2})
        r = svc.infer(req)
        assert r.outputs["result"] == 3

    def test_pipeline_engine_flow(self):
        p = create_ai_pipeline().add_stage("validate", lambda x: x).add_stage("transform", lambda x: {"value": x})
        out = p.run(10)
        assert out == {"value": 10}
