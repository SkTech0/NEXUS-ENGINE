"""Pipeline tests for engine-data."""
import pytest
from pipelines.data_pipeline import create_pipeline
from caching.cache_engine import create_cache_engine


class TestDataPipelineFlow:
    def test_extract_transform_load(self):
        p = (
            create_pipeline("etl")
            .add_stage("extract", lambda _: [1, 2, 3])
            .add_stage("transform", lambda x: [i * 2 for i in x])
            .add_stage("load", lambda x: {"count": len(x), "items": x})
        )
        out = p.run(None)
        assert out["count"] == 3
        assert out["items"] == [2, 4, 6]


class TestCacheEngine:
    def test_get_set(self):
        c = create_cache_engine()
        c.set("k", "v")
        assert c.get("k") == "v"

    def test_get_missing(self):
        c = create_cache_engine()
        assert c.get("missing") is None

    def test_delete(self):
        c = create_cache_engine()
        c.set("k", "v")
        assert c.delete("k") is True
        assert c.get("k") is None
        assert c.delete("k") is False

    def test_clear(self):
        c = create_cache_engine()
        c.set("a", 1)
        c.set("b", 2)
        c.clear()
        assert c.size() == 0
