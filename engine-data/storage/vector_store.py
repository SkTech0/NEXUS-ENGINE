"""
Vector store — store and query vectors (e.g. embeddings).
Enterprise: validation, logging, clear errors (ERL-4).
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-data")


@dataclass
class VectorEntry:
    """A stored vector with id and optional metadata."""

    id: str
    vector: list[float]
    metadata: dict[str, Any] = field(default_factory=dict)


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Cosine similarity between two vectors. Testable."""
    if len(a) != len(b) or len(a) == 0:
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(x * x for x in b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


class VectorStore:
    """
    In-memory vector store: add, get, search by similarity.
    Enterprise: input validation, structured logging, safe errors.
    """

    def __init__(self, dimension: int | None = None) -> None:
        self._dimension = dimension
        self._entries: dict[str, VectorEntry] = {}

    def add(self, entry: VectorEntry) -> None:
        """Add or replace vector. Validates id and dimension."""
        if not (entry.id or "").strip():
            raise ValidationError("vector entry id is required", details={"field": "id"})
        if not entry.vector:
            raise ValidationError("vector cannot be empty", details={"field": "vector"})
        if self._dimension is not None and len(entry.vector) != self._dimension:
            raise ValidationError(
                "Vector dimension mismatch",
                details={"expected": self._dimension, "actual": len(entry.vector)},
            )
        self._dimension = self._dimension or len(entry.vector)
        self._entries[entry.id] = entry
        _logger.info("vector_store.add id=%s dimension=%s", entry.id, len(entry.vector))

    def get(self, id: str) -> VectorEntry | None:
        """Get entry by id. Returns None if not found."""
        return self._entries.get(id)

    def delete(self, id: str) -> bool:
        """Remove entry. Returns True if removed."""
        if id in self._entries:
            del self._entries[id]
            _logger.debug("vector_store.delete id=%s", id)
            return True
        return False

    def search(
        self,
        query: list[float],
        top_k: int = 10,
        min_score: float | None = None,
    ) -> list[tuple[VectorEntry, float]]:
        """
        Search by similarity to query vector. Returns list of (entry, score).
        Validates query; logs result count.
        """
        if not query and self._dimension is not None:
            raise ValidationError("query vector cannot be empty", details={"field": "query"})
        if top_k < 1:
            raise ValidationError("top_k must be >= 1", details={"top_k": top_k})
        results: list[tuple[VectorEntry, float]] = []
        for entry in self._entries.values():
            score = cosine_similarity(query, entry.vector)
            if min_score is not None and score < min_score:
                continue
            results.append((entry, score))
        results.sort(key=lambda x: -x[1])
        out = results[:top_k]
        _logger.debug("vector_store.search top_k=%s results=%s", top_k, len(out))
        return out

    def size(self) -> int:
        """Number of stored vectors."""
        return len(self._entries)


def create_vector_store(dimension: int | None = None) -> VectorStore:
    """Create empty vector store. Enterprise-ready."""
    return VectorStore(dimension=dimension)
