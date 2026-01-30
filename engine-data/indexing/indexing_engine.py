"""
Indexing engine — build and query indexes over data.
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-data")


@dataclass
class IndexEntry:
    """An index entry: key and document id(s)."""

    key: str
    doc_ids: list[str] = field(default_factory=list)


class IndexingEngine:
    """
    In-memory indexing: add documents with a key extractor, query by key.
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(
        self,
        key_extractor: Callable[[dict[str, Any]], list[str]] | None = None,
    ) -> None:
        self._key_extractor = key_extractor or (lambda doc: [str(doc.get("id", ""))])
        self._index: dict[str, set[str]] = {}

    def index(self, doc_id: str, document: dict[str, Any]) -> None:
        """Index a document. Validates before state mutation."""
        if not (doc_id or "").strip():
            raise ValidationError("doc_id is required", details={"field": "doc_id"})
        if document is None:
            raise ValidationError("document is required", details={"field": "document"})
        keys = self._key_extractor(document)
        for k in keys:
            if k not in self._index:
                self._index[k] = set()
            self._index[k].add(doc_id)
        _logger.debug("indexing_engine.index doc_id=%s keys=%s", doc_id, len(keys))

    def remove(self, doc_id: str, document: dict[str, Any]) -> None:
        """Remove document from index. Validates inputs."""
        if not (doc_id or "").strip():
            raise ValidationError("doc_id is required", details={"field": "doc_id"})
        if document is None:
            raise ValidationError("document is required", details={"field": "document"})
        keys = self._key_extractor(document)
        for k in keys:
            if k in self._index:
                self._index[k].discard(doc_id)
                if not self._index[k]:
                    del self._index[k]
        _logger.debug("indexing_engine.remove doc_id=%s", doc_id)

    def get(self, key: str) -> list[str]:
        """Get doc ids for key. Validates key non-empty."""
        if not (key or "").strip():
            raise ValidationError("key is required", details={"field": "key"})
        return list(self._index.get(key, set()))

    def search(self, keys: list[str]) -> list[str]:
        """Get union of doc ids for all keys. Validates keys non-null."""
        if keys is None:
            raise ValidationError("keys is required", details={"field": "keys"})
        result: set[str] = set()
        for k in keys:
            result.update(self._index.get(k, set()))
        return list(result)

    def keys(self) -> list[str]:
        """All index keys. Testable."""
        return list(self._index.keys())


def create_indexing_engine(
    key_extractor: Callable[[dict[str, Any]], list[str]] | None = None,
) -> IndexingEngine:
    """Create indexing engine. Testable."""
    return IndexingEngine(key_extractor=key_extractor)
