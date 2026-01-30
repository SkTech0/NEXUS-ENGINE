"""
Data loader — load data from sources (in-memory, file-like, iterators).
ERL-4: validation at entry, structured logging, platform error model.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Callable, Iterator

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-data")


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
    Validates source and sink non-null before execution.
    """
    if source is None:
        raise ValidationError("source is required", details={"field": "source"})
    if sink is None:
        raise ValidationError("sink is required", details={"field": "sink"})
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
            _logger.debug("data_loader.record_error error=%s", e)
    _logger.info("data_pipeline.load_from_iter count=%s errors=%s", count, len(errors))
    return LoadResult(count=count, errors=errors)


def load_from_list(
    records: list[dict[str, Any]],
    sink: Callable[[dict[str, Any]], None],
    validator: Callable[[dict[str, Any]], tuple[bool, str]] | None = None,
) -> LoadResult:
    """Load from list of dicts. Validates records and sink non-null."""
    if records is None:
        raise ValidationError("records is required", details={"field": "records"})
    if sink is None:
        raise ValidationError("sink is required", details={"field": "sink"})
    return load_from_iter(iter(records), sink=sink, validator=validator)


class DataLoader:
    """
    Configurable loader: set source and sink, then load().
    ERL-4: entry-point validation, structured logging, fail-fast.
    """

    def __init__(
        self,
        sink: Callable[[dict[str, Any]], None],
        validator: Callable[[dict[str, Any]], tuple[bool, str]] | None = None,
    ) -> None:
        if sink is None:
            raise ValidationError("sink is required", details={"field": "sink"})
        self._sink = sink
        self._validator = validator

    def load(self, source: Iterator[dict[str, Any]]) -> LoadResult:
        """Load from iterator. Validates source non-null."""
        if source is None:
            raise ValidationError("source is required", details={"field": "source"})
        return load_from_iter(source, sink=self._sink, validator=self._validator)

    def load_records(self, records: list[dict[str, Any]]) -> LoadResult:
        """Load from list. Validates records non-null."""
        if records is None:
            raise ValidationError("records is required", details={"field": "records"})
        return load_from_list(records, sink=self._sink, validator=self._validator)


def create_data_loader(
    sink: Callable[[dict[str, Any]], None],
    validator: Callable[[dict[str, Any]], tuple[bool, str]] | None = None,
) -> DataLoader:
    """Create a data loader. Testable."""
    return DataLoader(sink=sink, validator=validator)
