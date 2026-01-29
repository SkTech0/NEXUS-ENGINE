"""
Auth service — authentication and RBAC (roles, permissions).
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Callable


@dataclass
class Principal:
    """Authenticated principal: id, tenant_id, roles, attributes."""

    id: str
    tenant_id: str
    roles: list[str] = field(default_factory=list)
    attributes: dict[str, str] = field(default_factory=dict)


@dataclass
class AuthResult:
    """Auth result: principal or error."""

    principal: Principal | None = None
    valid: bool = False
    error: str | None = None


class AuthService:
    """
    Auth: verify token (plugged validator), resolve principal; RBAC: has_role, has_permission.
    Testable.
    """

    def __init__(self) -> None:
        self._principals: dict[str, Principal] = {}
        self._role_permissions: dict[str, set[str]] = {}
        self._token_validator: Callable[[str], Principal | None] | None = None

    def set_token_validator(self, fn: Callable[[str], Principal | None]) -> None:
        """Set (token) -> principal or None. Testable."""
        self._token_validator = fn

    def verify(self, token: str) -> AuthResult:
        """Verify token; return AuthResult. Testable."""
        if self._token_validator is not None:
            principal = self._token_validator(token)
            if principal is not None:
                return AuthResult(principal=principal, valid=True)
        return AuthResult(valid=False, error="Invalid or missing token")

    def register_principal(self, key: str, principal: Principal) -> None:
        """Register principal by key (e.g. token). Testable."""
        self._principals[key] = principal

    def get_principal(self, key: str) -> Principal | None:
        """Get principal by key. Testable."""
        return self._principals.get(key)

    def add_role_permission(self, role: str, permission: str) -> None:
        """Grant permission to role. Testable."""
        self._role_permissions.setdefault(role, set()).add(permission)

    def has_role(self, principal: Principal, role: str) -> bool:
        """Check if principal has role. Testable."""
        return role in principal.roles

    def has_permission(self, principal: Principal, permission: str) -> bool:
        """Check if principal has permission (via any role). Testable."""
        for role in principal.roles:
            if permission in self._role_permissions.get(role, set()):
                return True
        return False


def create_auth_service() -> AuthService:
    """Create auth service. Testable."""
    return AuthService()
