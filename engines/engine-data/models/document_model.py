"""
Document data model — flexible document store with optional schema.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Document:
    """A document: id and flexible key-value body."""

    id: str
    body: dict[str, Any] = field(default_factory=dict)

    def get(self, path: str) -> Any:
        """Get value by dot path (e.g. 'a.b.c'). Testable."""
        keys = path.split(".")
        val: Any = self.body
        for k in keys:
            if isinstance(val, dict) and k in val:
                val = val[k]
            else:
                return None
        return val

    def set(self, path: str, value: Any) -> None:
        """Set value by dot path. Testable."""
        keys = path.split(".")
        d = self.body
        for k in keys[:-1]:
            if k not in d or not isinstance(d[k], dict):
                d[k] = {}
            d = d[k]
        d[keys[-1]] = value


class DocumentModel:
    """
    In-memory document store: collection -> documents.
    Testable.
    """

    def __init__(self) -> None:
        self._collections: dict[str, dict[str, Document]] = {}

    def get_collection(self, name: str) -> dict[str, Document]:
        """Get or create collection. Testable."""
        if name not in self._collections:
            self._collections[name] = {}
        return self._collections[name]

    def insert(self, collection: str, doc: Document) -> None:
        """Insert or replace document. Testable."""
        self.get_collection(collection)[doc.id] = doc

    def get(self, collection: str, doc_id: str) -> Document | None:
        """Get document by id. Testable."""
        return self.get_collection(collection).get(doc_id)

    def delete(self, collection: str, doc_id: str) -> bool:
        """Delete document. Returns True if removed. Testable."""
        coll = self.get_collection(collection)
        if doc_id in coll:
            del coll[doc_id]
            return True
        return False

    def find(self, collection: str, predicate: Any) -> list[Document]:
        """Find documents where predicate(doc) is True. Testable."""
        return [d for d in self.get_collection(collection).values() if predicate(d)]

    def list_collections(self) -> list[str]:
        """All collection names. Testable."""
        return list(self._collections.keys())


def create_document_model() -> DocumentModel:
    """Create empty document model. Testable."""
    return DocumentModel()
