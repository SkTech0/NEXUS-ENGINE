"""
Graph data model — nodes, edges, and graph operations.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Node:
    """A graph node with id and optional properties."""

    id: str
    label: str = ""
    properties: dict[str, Any] = field(default_factory=dict)


@dataclass
class Edge:
    """A directed edge between two nodes."""

    id: str
    source_id: str
    target_id: str
    label: str = ""
    properties: dict[str, Any] = field(default_factory=dict)


class GraphModel:
    """
    In-memory graph: nodes and edges.
    Testable.
    """

    def __init__(self) -> None:
        self._nodes: dict[str, Node] = {}
        self._edges: dict[str, Edge] = {}
        self._out_edges: dict[str, list[str]] = {}
        self._in_edges: dict[str, list[str]] = {}

    def add_node(self, node: Node) -> None:
        """Add or replace a node. Testable."""
        self._nodes[node.id] = node
        self._out_edges.setdefault(node.id, [])
        self._in_edges.setdefault(node.id, [])

    def add_edge(self, edge: Edge) -> None:
        """Add or replace an edge. Testable."""
        self._edges[edge.id] = edge
        self._out_edges.setdefault(edge.source_id, []).append(edge.id)
        self._in_edges.setdefault(edge.target_id, []).append(edge.id)

    def get_node(self, node_id: str) -> Node | None:
        """Get node by id. Testable."""
        return self._nodes.get(node_id)

    def get_edge(self, edge_id: str) -> Edge | None:
        """Get edge by id. Testable."""
        return self._edges.get(edge_id)

    def get_neighbors(self, node_id: str, direction: str = "out") -> list[Node]:
        """Get adjacent nodes (outgoing or incoming). Testable."""
        edge_ids = self._out_edges.get(node_id, []) if direction == "out" else self._in_edges.get(node_id, [])
        nodes: list[Node] = []
        for eid in edge_ids:
            e = self._edges.get(eid)
            if e is None:
                continue
            other_id = e.target_id if direction == "out" else e.source_id
            n = self._nodes.get(other_id)
            if n is not None:
                nodes.append(n)
        return nodes

    def nodes(self) -> list[Node]:
        """All nodes. Testable."""
        return list(self._nodes.values())

    def edges(self) -> list[Edge]:
        """All edges. Testable."""
        return list(self._edges.values())


def create_graph() -> GraphModel:
    """Create empty graph. Testable."""
    return GraphModel()
