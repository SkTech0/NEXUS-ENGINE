"""
Relational data model — tables, rows, and simple relational operations.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Column:
    """Column definition: name and type hint."""

    name: str
    dtype: str = "any"


@dataclass
class Row:
    """A row: ordered values keyed by column name."""

    values: dict[str, Any] = field(default_factory=dict)

    def get(self, column: str) -> Any:
        """Get value by column. Testable."""
        return self.values.get(column)

    def set(self, column: str, value: Any) -> None:
        """Set value. Testable."""
        self.values[column] = value


@dataclass
class Table:
    """Table: schema (columns) and rows."""

    name: str
    columns: list[Column] = field(default_factory=list)
    rows: list[Row] = field(default_factory=list)

    def insert(self, row: Row) -> None:
        """Insert a row. Testable."""
        self.rows.append(row)

    def select(self, columns: list[str] | None = None) -> list[Row]:
        """Select rows (optionally project columns). Testable."""
        if columns is None:
            return list(self.rows)
        return [
            Row(values={c: r.values.get(c) for c in columns if c in r.values})
            for r in self.rows
        ]

    def where(self, predicate: Any) -> list[Row]:
        """Filter rows by predicate(row) -> bool. Testable."""
        return [r for r in self.rows if predicate(r)]


class RelationalModel:
    """
    In-memory relational model: named tables.
    Testable.
    """

    def __init__(self) -> None:
        self._tables: dict[str, Table] = {}

    def create_table(self, name: str, columns: list[Column]) -> Table:
        """Create table. Testable."""
        t = Table(name=name, columns=list(columns))
        self._tables[name] = t
        return t

    def get_table(self, name: str) -> Table | None:
        """Get table by name. Testable."""
        return self._tables.get(name)

    def tables(self) -> list[str]:
        """All table names. Testable."""
        return list(self._tables.keys())


def create_relational_model() -> RelationalModel:
    """Create empty relational model. Testable."""
    return RelationalModel()
