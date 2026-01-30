"""Core unit tests for engine-ai."""
import pytest
from errors.error_model import ValidationError
from inference.inference_service import (
    InferenceRequest,
    InferenceResponse,
    InferenceService,
    create_inference_service,
)


class TestInferenceRequest:
    def test_request_default_options(self):
        r = InferenceRequest(model_id="m1", inputs={"x": 1})
        assert r.model_id == "m1"
        assert r.inputs == {"x": 1}
        assert r.options is None

    def test_request_with_options(self):
        r = InferenceRequest(model_id="m1", inputs={}, options={"threshold": 0.5})
        assert r.options == {"threshold": 0.5}


class TestInferenceResponse:
    def test_response_defaults(self):
        r = InferenceResponse(outputs={"y": 2})
        assert r.outputs == {"y": 2}
        assert r.latency_ms == 0.0
        assert r.model_id == ""


class TestInferenceService:
    def test_create_service(self):
        svc = create_inference_service()
        assert isinstance(svc, InferenceService)

    def test_infer_no_loader_returns_empty(self):
        svc = InferenceService()
        req = InferenceRequest(model_id="m1", inputs={"x": 1})
        resp = svc.infer(req)
        assert resp.outputs == {}
        assert resp.model_id == "m1"
        assert resp.latency_ms >= 0

    def test_infer_with_loader_and_predict(self):
        svc = InferenceService()
        svc.set_model_loader(lambda mid: "model")
        svc.set_predict_fn(lambda m, inp: {"out": inp.get("x", 0) * 2})
        req = InferenceRequest(model_id="m1", inputs={"x": 3})
        resp = svc.infer(req)
        assert resp.outputs == {"out": 6}
        assert resp.model_id == "m1"

    def test_infer_validates_request_null(self):
        svc = create_inference_service()
        with pytest.raises(ValidationError) as exc_info:
            svc.infer(None)
        assert "null" in str(exc_info.value).lower() or "required" in str(exc_info.value).lower()

    def test_infer_validates_request_missing_model_id(self):
        svc = create_inference_service()
        req = InferenceRequest(model_id="", inputs={"x": 1})
        with pytest.raises(ValidationError):
            svc.infer(req)

    def test_infer_validates_request_missing_inputs(self):
        svc = create_inference_service()
        req = InferenceRequest(model_id="m1", inputs=None)
        with pytest.raises(ValidationError):
            svc.infer(req)
