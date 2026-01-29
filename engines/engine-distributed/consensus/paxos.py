"""
Paxos consensus — proposer, acceptor, learner.
Modular, testable implementation of classic Paxos phases.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Proposal:
    """A proposal (round number, value)."""

    round: int
    value: Any


@dataclass
class AcceptorState:
    """Acceptor state: highest promised round and accepted proposal."""

    promised_round: int = -1
    accepted: Proposal | None = None


def create_proposal(round_id: int, value: Any) -> Proposal:
    """Create a new proposal. Testable."""
    return Proposal(round=round_id, value=value)


def promise(acceptor_state: AcceptorState, round_id: int) -> tuple[bool, Proposal | None]:
    """
    Phase 1a/1b: Proposer sends prepare(n); acceptor promises not to accept lower rounds.
    Returns (accepted, previous_accepted_if_any).
    """
    if round_id <= acceptor_state.promised_round:
        return (False, None)
    acceptor_state.promised_round = round_id
    return (True, acceptor_state.accepted)


def accept(
    acceptor_state: AcceptorState, proposal: Proposal
) -> bool:
    """
    Phase 2a/2b: Proposer sends accept(n, v); acceptor accepts if n >= promised_round.
    """
    if proposal.round < acceptor_state.promised_round:
        return False
    acceptor_state.accepted = proposal
    return True


def learn(acceptor_states: list[AcceptorState]) -> Any | None:
    """
    Learner: choose value from a majority of acceptors.
    Returns the chosen value if a majority have the same accepted value.
    """
    accepted_values: list[Any] = []
    for state in acceptor_states:
        if state.accepted is not None:
            accepted_values.append(state.accepted.value)
    if not accepted_values:
        return None
    # Majority = same value from more than half
    n = len(acceptor_states)
    for v in accepted_values:
        if sum(1 for x in accepted_values if x == v) > n // 2:
            return v
    return None


def run_propose(
    value: Any,
    round_id: int,
    acceptor_states: list[AcceptorState],
) -> Any | None:
    """
    Run one round of Paxos: prepare, accept, learn.
    Testable end-to-end with in-memory acceptor list.
    """
    proposal = create_proposal(round_id, value)
    promised_count = 0
    for state in acceptor_states:
        ok, _ = promise(state, round_id)
        if ok:
            promised_count += 1
    if promised_count <= len(acceptor_states) // 2:
        return None
    accept_count = 0
    for state in acceptor_states:
        if accept(state, proposal):
            accept_count += 1
    if accept_count <= len(acceptor_states) // 2:
        return None
    return learn(acceptor_states)
