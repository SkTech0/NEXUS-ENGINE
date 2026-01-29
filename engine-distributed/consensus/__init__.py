"""Consensus: Paxos and Raft."""
from .paxos import (
    AcceptorState,
    Proposal,
    accept,
    create_proposal,
    learn,
    promise,
    run_propose,
)
from .raft import (
    LogEntry,
    NodeRole,
    RaftState,
    append_entries,
    append_entry,
    become_candidate,
    create_raft_state,
    request_vote,
)

__all__ = [
    "Proposal",
    "AcceptorState",
    "create_proposal",
    "promise",
    "accept",
    "learn",
    "run_propose",
    "LogEntry",
    "NodeRole",
    "RaftState",
    "create_raft_state",
    "become_candidate",
    "request_vote",
    "append_entries",
    "append_entry",
]
