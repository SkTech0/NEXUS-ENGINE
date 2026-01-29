"""
Indexing engine — build and query indexes over data.
Modular, testable; in-memory indexes.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class IndexEntry:
    """An index entry: key and document id(s)."""

    key: str
    doc_ids: list[str] = field(default_factory=list)


class IndexingEngine:
    """
    In-memory indexing: add documents with a key extractor, query by key.
    Testable.
    """

    def __init__(
        self,
        key_extractor: Callable[[dict[str, Any]], list[str]] | None = None,
    ) -> None:
        self._key_extractor = key_extractor or (lambda doc: [str(doc.get("id", ""))])
        self._index: dict[str, set[str]] = {}

    def index(self, doc_id: str, document: dict[str, Any]) -> None:
        """Index a document. Testable."""
        keys = self._key_extractor(document)
        for k in keys:
            if k not in self._index:
                self._index[k] = set()
            self._index[k].add(doc_id)

    def remove(self, doc_id: str, document: dict[str, Any]) -> None:
        """Remove document from index. Testable."""
        keys = self._key_extractor(document)
        for k in keys:
            if k in self._index:
                self._index[k].discard(doc_id)
                if not self._index[k]:
                    del self._index[k]

    def get(self, key: str) -> list[str]:
        """Get doc ids for key. Testable."""
        return list(self._index.get(key, set()))

    def search(self, keys: list[str]) -> list[str]:
        """Get union of doc ids for all keys. Testable."""
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
