"""
Vector store — store and query vectors (e.g. embeddings).
Modular, testable; in-memory implementation.
"""
from dataclasses import dataclass, field
from typing import Any


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
    Testable.
    """

    def __init__(self, dimension: int | None = None) -> None:
        self._dimension = dimension
        self._entries: dict[str, VectorEntry] = {}

    def add(self, entry: VectorEntry) -> None:
        """Add or replace vector. Testable."""
        if self._dimension is not None and len(entry.vector) != self._dimension:
            raise ValueError("Vector dimension mismatch")
        self._dimension = self._dimension or len(entry.vector)
        self._entries[entry.id] = entry

    def get(self, id: str) -> VectorEntry | None:
        """Get entry by id. Testable."""
        return self._entries.get(id)

    def delete(self, id: str) -> bool:
        """Remove entry. Returns True if removed. Testable."""
        if id in self._entries:
            del self._entries[id]
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
        Testable.
        """
        results: list[tuple[VectorEntry, float]] = []
        for entry in self._entries.values():
            score = cosine_similarity(query, entry.vector)
            if min_score is not None and score < min_score:
                continue
            results.append((entry, score))
        results.sort(key=lambda x: -x[1])
        return results[:top_k]

    def size(self) -> int:
        """Number of stored vectors. Testable."""
        return len(self._entries)


def create_vector_store(dimension: int | None = None) -> VectorStore:
    """Create empty vector store. Testable."""
    return VectorStore(dimension=dimension)
