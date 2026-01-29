"""
Raft consensus — leader election and log replication.
Modular, testable types and functions.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class NodeRole(Enum):
    FOLLOWER = "follower"
    CANDIDATE = "candidate"
    LEADER = "leader"


@dataclass
class LogEntry:
    """Single log entry: term and command."""

    term: int
    command: Any


@dataclass
class RaftState:
    """Raft node state: role, term, voted_for, log."""

    node_id: str
    role: NodeRole = NodeRole.FOLLOWER
    term: int = 0
    voted_for: str | None = None
    log: list[LogEntry] = field(default_factory=list)


def create_raft_state(node_id: str) -> RaftState:
    """Create initial Raft state. Testable."""
    return RaftState(node_id=node_id)


def become_candidate(state: RaftState) -> RaftState:
    """Transition to candidate and increment term. Returns new state (immutable style)."""
    return RaftState(
        node_id=state.node_id,
        role=NodeRole.CANDIDATE,
        term=state.term + 1,
        voted_for=state.node_id,
        log=list(state.log),
    )


def request_vote(
    state: RaftState,
    candidate_id: str,
    candidate_term: int,
    last_log_index: int,
    last_log_term: int,
) -> tuple[bool, RaftState]:
    """
    Handle RequestVote RPC. Grant vote if candidate is at least as up-to-date.
    Returns (vote_granted, updated_state).
    """
    if candidate_term < state.term:
        return (False, state)
    if candidate_term > state.term:
        state = RaftState(
            node_id=state.node_id,
            role=NodeRole.FOLLOWER,
            term=candidate_term,
            voted_for=None,
            log=list(state.log),
        )
    if state.voted_for is not None and state.voted_for != candidate_id:
        return (False, state)
    # Simplified: grant if candidate's log is at least as long
    our_last_index = len(state.log) - 1
    our_last_term = state.log[-1].term if state.log else 0
    if last_log_term < our_last_term or (
        last_log_term == our_last_term and last_log_index < our_last_index
    ):
        return (False, state)
    new_state = RaftState(
        node_id=state.node_id,
        role=NodeRole.FOLLOWER,
        term=state.term,
        voted_for=candidate_id,
        log=list(state.log),
    )
    return (True, new_state)


def append_entries(
    state: RaftState,
    leader_term: int,
    prev_log_index: int,
    prev_log_term: int,
    entries: list[LogEntry],
    leader_commit: int,
) -> tuple[bool, RaftState]:
    """
    Handle AppendEntries RPC. Returns (success, updated_state).
    """
    if leader_term < state.term:
        return (False, state)
    if leader_term > state.term:
        state = RaftState(
            node_id=state.node_id,
            role=NodeRole.FOLLOWER,
            term=leader_term,
            voted_for=None,
            log=list(state.log),
        )
    if prev_log_index >= 0:
        if prev_log_index >= len(state.log):
            return (False, state)
        if state.log[prev_log_index].term != prev_log_term:
            state = RaftState(
                node_id=state.node_id,
                role=state.role,
                term=state.term,
                voted_for=state.voted_for,
                log=state.log[:prev_log_index],
            )
    new_log = list(state.log) + list(entries)
    commit_index = min(leader_commit, len(new_log) - 1)
    new_state = RaftState(
        node_id=state.node_id,
        role=NodeRole.FOLLOWER,
        term=leader_term,
        voted_for=state.voted_for,
        log=new_log,
    )
    return (True, new_state)


def append_entry(state: RaftState, term: int, command: Any) -> RaftState:
    """Leader appends a new entry. Testable."""
    new_log = list(state.log) + [LogEntry(term=term, command=command)]
    return RaftState(
        node_id=state.node_id,
        role=state.role,
        term=state.term,
        voted_for=state.voted_for,
        log=new_log,
    )
