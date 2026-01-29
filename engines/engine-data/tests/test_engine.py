"""Engine-level tests for engine-data."""
import pytest
from pipelines.data_pipeline import create_pipeline
from caching.cache_engine import create_cache_engine


class TestDataEngine:
    def test_pipeline_with_cache_like_flow(self):
        cache = create_cache_engine()
        cache.set("input", {"raw": [1, 2, 3]})
        data = cache.get("input")
        assert data is not None
        p = create_pipeline().add_stage("sum", lambda d: sum(d["raw"]))
        out = p.run(data)
        assert out == 6

    def test_multi_stage_engine(self):
        p = (
            create_pipeline()
            .add_stage("validate", lambda x: x if isinstance(x, dict) else {"value": x})
            .add_stage("enrich", lambda d: {**d, "enriched": True})
        )
        assert p.run({"k": "v"})["enriched"] is True
