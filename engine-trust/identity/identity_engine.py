"""
Identity engine — manage identities, attributes, and roles.
Enterprise: validation, logging, clear errors (ERL-4).
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from errors.error_model import ValidationError

_logger = logging.getLogger("engine-trust")


@dataclass
class Identity:
    """An identity: id, type, attributes, roles."""

    id: str
    type: str = "user"
    attributes: dict[str, Any] = field(default_factory=dict)
    roles: list[str] = field(default_factory=list)

    def has_role(self, role: str) -> bool:
        """Check if identity has role. Testable."""
        return role in self.roles

    def get_attr(self, key: str) -> Any:
        """Get attribute. Testable."""
        return self.attributes.get(key)


class IdentityEngine:
    """
    Identity store: register, get, list; optional role/attr checks.
    Enterprise: input validation, structured logging, safe errors.
    """

    def __init__(self) -> None:
        self._identities: dict[str, Identity] = {}

    def register(self, identity: Identity) -> None:
        """Register or replace identity. Validates identity id."""
        if not (identity.id or "").strip():
            raise ValidationError("identity id is required", details={"field": "id"})
        self._identities[identity.id] = identity
        _logger.info("identity_engine.register id=%s type=%s", identity.id, identity.type)

    def get(self, identity_id: str) -> Identity | None:
        """Get identity by id. Returns None if not found."""
        if not (identity_id or "").strip():
            raise ValidationError("identity_id is required", details={"field": "identity_id"})
        return self._identities.get(identity_id)

    def delete(self, identity_id: str) -> bool:
        """Remove identity. Returns True if removed."""
        if not (identity_id or "").strip():
            raise ValidationError("identity_id is required", details={"field": "identity_id"})
        if identity_id in self._identities:
            del self._identities[identity_id]
            _logger.debug("identity_engine.delete id=%s", identity_id)
            return True
        return False

    def list_ids(self) -> list[str]:
        """All identity ids. Testable."""
        return list(self._identities.keys())

    def list_by_role(self, role: str) -> list[Identity]:
        """Identities with given role. Testable."""
        return [i for i in self._identities.values() if i.has_role(role)]


def create_identity_engine() -> IdentityEngine:
    """Create identity engine. Testable."""
    return IdentityEngine()
