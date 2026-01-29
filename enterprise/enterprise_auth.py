"""
Enterprise auth — SSO-style auth, org hierarchy, and enterprise principals.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class EnterprisePrincipal:
    """Enterprise principal: id, org_id, roles, attributes."""

    id: str
    org_id: str
    roles: list[str] = field(default_factory=list)
    attributes: dict[str, Any] = field(default_factory=dict)


@dataclass
class AuthResult:
    """Auth result: principal or error."""

    principal: EnterprisePrincipal | None = None
    valid: bool = False
    error: str | None = None


@dataclass
class OrgNode:
    """Org node: id, name, parent_id, children."""

    id: str
    name: str
    parent_id: str | None = None


class EnterpriseAuth:
    """
    Enterprise auth: set validator; verify(token); org hierarchy (optional).
    Testable.
    """

    def __init__(self) -> None:
        self._validator: Callable[[str], EnterprisePrincipal | None] | None = None
        self._orgs: dict[str, OrgNode] = {}

    def set_validator(self, fn: Callable[[str], EnterprisePrincipal | None]) -> None:
        """Set (token) -> principal or None. Testable."""
        self._validator = fn

    def verify(self, token: str) -> AuthResult:
        """Verify token; return AuthResult. Testable."""
        if self._validator is not None:
            principal = self._validator(token)
            if principal is not None:
                return AuthResult(principal=principal, valid=True)
        return AuthResult(valid=False, error="Invalid or missing token")

    def add_org(self, node: OrgNode) -> None:
        """Add org node. Testable."""
        self._orgs[node.id] = node

    def get_org(self, org_id: str) -> OrgNode | None:
        """Get org by id. Testable."""
        return self._orgs.get(org_id)

    def get_ancestors(self, org_id: str) -> list[OrgNode]:
        """Get ancestor orgs (parent chain). Testable."""
        ancestors: list[OrgNode] = []
        current = self._orgs.get(org_id)
        while current and current.parent_id:
            parent = self._orgs.get(current.parent_id)
            if parent is None:
                break
            ancestors.append(parent)
            current = parent
        return ancestors


def create_enterprise_auth() -> EnterpriseAuth:
    """Create enterprise auth. Testable."""
    return EnterpriseAuth()
