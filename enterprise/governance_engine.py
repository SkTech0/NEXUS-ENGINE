"""
Governance engine — policies, approvals, and governance workflows.
Modular, testable.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable


class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


@dataclass
class GovernancePolicy:
    """A policy: id, name, evaluate function."""

    id: str
    name: str
    evaluate: Callable[[Any], bool]


@dataclass
class ApprovalRequest:
    """Approval request: id, subject, requester, status."""

    id: str
    subject: Any
    requester: str = ""
    status: ApprovalStatus = ApprovalStatus.PENDING


class GovernanceEngine:
    """
    Governance: add policies; evaluate(subject); create/approve/reject approvals.
    Testable.
    """

    def __init__(self) -> None:
        self._policies: dict[str, GovernancePolicy] = {}
        self._approvals: dict[str, ApprovalRequest] = {}

    def add_policy(self, policy: GovernancePolicy) -> None:
        """Add governance policy. Testable."""
        self._policies[policy.id] = policy

    def evaluate(self, subject: Any) -> dict[str, bool]:
        """Evaluate all policies; return policy_id -> passed. Testable."""
        return {pid: p.evaluate(subject) for pid, p in self._policies.items()}

    def create_approval(self, approval_id: str, subject: Any, requester: str = "") -> ApprovalRequest:
        """Create approval request. Testable."""
        req = ApprovalRequest(id=approval_id, subject=subject, requester=requester)
        self._approvals[approval_id] = req
        return req

    def approve(self, approval_id: str) -> bool:
        """Approve request. Testable."""
        req = self._approvals.get(approval_id)
        if req is None:
            return False
        req.status = ApprovalStatus.APPROVED
        return True

    def reject(self, approval_id: str) -> bool:
        """Reject request. Testable."""
        req = self._approvals.get(approval_id)
        if req is None:
            return False
        req.status = ApprovalStatus.REJECTED
        return True

    def get_approval(self, approval_id: str) -> ApprovalRequest | None:
        """Get approval by id. Testable."""
        return self._approvals.get(approval_id)


def create_governance_engine() -> GovernanceEngine:
    """Create governance engine. Testable."""
    return GovernanceEngine()
