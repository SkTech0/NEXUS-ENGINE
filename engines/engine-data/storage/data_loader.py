"""
Data loader — load data from sources (in-memory, file-like, iterators).
Modular, testable.
"""
from dataclasses import dataclass
from typing import Any, Callable, Iterator


@dataclass
class LoadResult:
    """Result of a load: count and optional errors."""

    count: int
    errors: list[str]


def load_from_iter(
    source: Iterator[dict[str, Any]],
    sink: Callable[[dict[str, Any]], None],
    validator: Callable[[dict[str, Any]], tuple[bool, str]] | None = None,
) -> LoadResult:
    """
    Load records from an iterator; optionally validate; push to sink.
    Returns LoadResult. Testable.
    """
    count = 0
    errors: list[str] = []
    for record in source:
        if validator is not None:
            ok, msg = validator(record)
            if not ok:
                errors.append(msg)
                continue
        try:
            sink(record)
            count += 1
        except Exception as e:
            errors.append(str(e))
    return LoadResult(count=count, errors=errors)


def load_from_list(
    records: list[dict[str, Any]],
    sink: Callable[[dict[str, Any]], None],
    validator: Callable[[dict[str, Any]], tuple[bool, str]] | None = None,
) -> LoadResult:
    """Load from list of dicts. Testable."""
    return load_from_iter(iter(records), sink=sink, validator=validator)


class DataLoader:
    """
    Configurable loader: set source and sink, then load().
    Testable.
    """

    def __init__(
        self,
        sink: Callable[[dict[str, Any]], None],
        validator: Callable[[dict[str, Any]], tuple[bool, str]] | None = None,
    ) -> None:
        self._sink = sink
        self._validator = validator

    def load(self, source: Iterator[dict[str, Any]]) -> LoadResult:
        """Load from iterator. Testable."""
        return load_from_iter(source, sink=self._sink, validator=self._validator)

    def load_records(self, records: list[dict[str, Any]]) -> LoadResult:
        """Load from list. Testable."""
        return load_from_list(records, sink=self._sink, validator=self._validator)


def create_data_loader(
    sink: Callable[[dict[str, Any]], None],
    validator: Callable[[dict[str, Any]], tuple[bool, str]] | None = None,
) -> DataLoader:
    """Create a data loader. Testable."""
    return DataLoader(sink=sink, validator=validator)
