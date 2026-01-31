"""
Domain facade: wires engine-data domain (pipelines, indexing, storage, caching, validation)
for use by the service layer. Stateless HTTP layer; domain holds in-memory state.
"""
from __future__ import annotations

import hashlib
import json
import logging
from pathlib import Path
from typing import Any

# Bootstrap path so engine-data domain is importable when running from repo.
# In Docker /app/app/domain_facade.py has only 3 parents; avoid parents[3] to prevent IndexError.
_resolved = Path(__file__).resolve()
_engine_data_root = (_resolved.parents[3] / "engine-data") if len(_resolved.parents) > 3 else Path("/__no_engine_data__")
if _engine_data_root.exists():
    import sys
    _path = str(_engine_data_root)
    if _path not in sys.path:
        sys.path.insert(0, _path)

_logger = logging.getLogger("engine-data-service")

# Default collection and cache TTL
_DEFAULT_COLLECTION = "default"
_QUERY_CACHE_TTL_SECONDS = 300.0


def _key_extractor(doc: dict[str, Any]) -> list[str]:
    """Extract index keys from a document: id plus optional keywords/tags. Generic, reusable."""
    keys = [str(doc.get("id", ""))] if doc.get("id") else []
    for field in ("keywords", "tags", "keys"):
        val = doc.get(field)
        if isinstance(val, list):
            keys.extend(str(v) for v in val if v is not None)
        elif isinstance(val, str) and val.strip():
            keys.append(val.strip())
    return [k for k in keys if k]


def _ensure_engine() -> "DataEngineContext":
    if _engine_context is None:
        raise RuntimeError("Data engine not initialized; call init_engine() at startup")
    return _engine_context


def init_engine() -> None:
    """
    Initialize domain engines: document store, indexing, pipeline, cache, validation.
    Idempotent; safe to call from lifecycle startup.
    If engine-data is not on path or any error occurs, logs and leaves engine uninitialized (health still works).
    """
    global _engine_context
    try:
        from errors.error_model import ValidationError
        from models.document_model import Document, DocumentModel, create_document_model
        from indexing.indexing_engine import IndexingEngine, create_indexing_engine
        from pipelines.data_pipeline import DataPipeline, create_pipeline
        from caching.cache_engine import CacheEngine, create_cache_engine
        from validation.validation_layer import ValidationLayer, ValidationResult, ValidationIssue
    except ImportError as e:
        _logger.warning("engine-data domain not available; data operations will fail. %s", e)
        return

    document_model = create_document_model()
    indexing_engine = create_indexing_engine(key_extractor=_key_extractor)
    cache_engine: CacheEngine[Any, Any] = create_cache_engine(
        default_ttl_seconds=_QUERY_CACHE_TTL_SECONDS
    )
    validation_layer = ValidationLayer()

    def validate_record(record: Any) -> ValidationResult:
        if record is None:
            return ValidationResult(valid=False, issues=[ValidationIssue(message="record is null", code="NULL_INPUT")])
        if not isinstance(record, dict):
            return ValidationResult(valid=False, issues=[ValidationIssue(message="record must be a dict", code="INVALID_TYPE")])
        doc_id = record.get("id")
        if not doc_id and not record:
            return ValidationResult(valid=False, issues=[ValidationIssue(message="record must have id or content", code="MISSING_ID")])
        return ValidationResult(valid=True)

    def store_stage(data: Any) -> Any:
        if not isinstance(data, dict):
            raise ValidationError("store stage expects dict", details={"field": "data"})
        doc_id = str(data.get("id") or hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()[:16])
        doc = Document(id=doc_id, body=dict(data))
        document_model.insert(_DEFAULT_COLLECTION, doc)
        return {"doc_id": doc_id, "document": data}

    def index_stage(data: Any) -> Any:
        if not isinstance(data, dict) or "doc_id" not in data or "document" not in data:
            raise ValidationError("index stage expects {doc_id, document}", details={"field": "data"})
        doc_id = data["doc_id"]
        document = {**data["document"], "id": doc_id}
        indexing_engine.index(doc_id, document)
        return doc_id

    ingestion_pipeline = (
        create_pipeline(name="ingestion")
        .add_stage("store", lambda d: store_stage(d))
        .add_stage("index", lambda d: index_stage(d))
    )

    def validator_index(input_data: Any) -> ValidationResult:
        if input_data is None:
            return ValidationResult(valid=False, issues=[ValidationIssue(message="payload is null", code="NULL_INPUT")])
        if isinstance(input_data, dict):
            if "documents" in input_data:
                if not isinstance(input_data["documents"], list):
                    return ValidationResult(valid=False, issues=[ValidationIssue(message="documents must be a list", code="INVALID_TYPE")])
            else:
                # Single document
                return validate_record(input_data)
            return ValidationResult(valid=True)
        return ValidationResult(valid=False, issues=[ValidationIssue(message="payload must be a dict", code="INVALID_TYPE")])

    def validator_query(input_data: Any) -> ValidationResult:
        if input_data is None:
            return ValidationResult(valid=False, issues=[ValidationIssue(message="query_spec is null", code="NULL_INPUT")])
        if not isinstance(input_data, dict):
            return ValidationResult(valid=False, issues=[ValidationIssue(message="query_spec must be a dict", code="INVALID_TYPE")])
        return ValidationResult(valid=True)

    validation_layer.register("index", validator_index)
    validation_layer.register("query", validator_query)

    class DataEngineContext:
        def __init__(
            self,
            document_model: DocumentModel,
            indexing_engine: IndexingEngine,
            cache_engine: CacheEngine[Any, Any],
            validation_layer: ValidationLayer,
            ingestion_pipeline: DataPipeline[Any],
        ):
            self.document_model = document_model
            self.indexing_engine = indexing_engine
            self.cache_engine = cache_engine
            self.validation_layer = validation_layer
            self.ingestion_pipeline = ingestion_pipeline

        def index_documents(self, payload: dict[str, Any]) -> dict[str, Any]:
            """Run payload through validation, then pipeline; return indexed count and errors."""
            result = self.validation_layer.validate_input("index", payload)
            if not result.valid:
                issues = [f"{i.path or 'payload'}: {i.message}" for i in result.issues]
                raise ValidationError("Validation failed", details={"issues": issues})
            indexed = 0
            errors: list[str] = []
            documents = payload.get("documents")
            if documents is not None:
                for i, record in enumerate(documents):
                    if not isinstance(record, dict):
                        errors.append(f"documents[{i}]: not a dict")
                        continue
                    vr = validate_record(record)
                    if not vr.valid:
                        errors.extend(f"documents[{i}]: {iss.message}" for iss in vr.issues)
                        continue
                    try:
                        self.ingestion_pipeline.run(record)
                        indexed += 1
                    except Exception as e:
                        errors.append(f"documents[{i}]: {e}")
            else:
                try:
                    self.ingestion_pipeline.run(payload)
                    indexed = 1
                except Exception as e:
                    errors.append(str(e))
            _logger.info("domain_facade.index_documents indexed=%s errors=%s", indexed, len(errors))
            return {"indexed": indexed, "errors": errors}

        def query_documents(self, query_spec: dict[str, Any]) -> dict[str, Any]:
            """Validate query_spec, check cache, then run index search and return results."""
            result = self.validation_layer.validate_input("query", query_spec)
            if not result.valid:
                issues = [f"{i.path or 'query'}: {i.message}" for i in result.issues]
                raise ValidationError("Validation failed", details={"issues": issues})
            cache_key = hashlib.sha256(json.dumps(query_spec, sort_keys=True).encode()).hexdigest()
            cached = self.cache_engine.get(cache_key)
            if cached is not None:
                _logger.debug("domain_facade.query_documents cache_hit key=%s", cache_key[:8])
                return cached
            keys = query_spec.get("keys") or query_spec.get("key")
            if isinstance(keys, str):
                keys = [keys]
            if not keys:
                keys = []
            doc_ids = self.indexing_engine.search(keys) if keys else []
            results: list[dict[str, Any]] = []
            for doc_id in doc_ids:
                doc = self.document_model.get(_DEFAULT_COLLECTION, doc_id)
                if doc is not None:
                    results.append({"id": doc.id, **doc.body})
            out = {"results": results, "count": len(results)}
            self.cache_engine.set(cache_key, out, ttl_seconds=_QUERY_CACHE_TTL_SECONDS)
            _logger.info("domain_facade.query_documents keys=%s count=%s", len(keys), len(results))
            return out

    global _engine_context
    _engine_context = DataEngineContext(
        document_model=document_model,
        indexing_engine=indexing_engine,
        cache_engine=cache_engine,
        validation_layer=validation_layer,
        ingestion_pipeline=ingestion_pipeline,
    )
    _logger.info("domain_facade.init_engine ready")


_engine_context: "DataEngineContext | None" = None


def index_documents(payload: dict[str, Any]) -> dict[str, Any]:
    """Index payload (single doc or documents list) via pipeline and indexing. Domain entrypoint."""
    return _ensure_engine().index_documents(payload)


def query_documents(query_spec: dict[str, Any]) -> dict[str, Any]:
    """Query by keys; use cache when applicable. Domain entrypoint."""
    return _ensure_engine().query_documents(query_spec)


def validate_index_input(payload: Any) -> "ValidationResult":
    """Validate index payload using domain validation layer."""
    ctx = _ensure_engine()
    return ctx.validation_layer.validate_input("index", payload)


def validate_query_input(query_spec: Any) -> "ValidationResult":
    """Validate query spec using domain validation layer."""
    ctx = _ensure_engine()
    return ctx.validation_layer.validate_input("query", query_spec)
