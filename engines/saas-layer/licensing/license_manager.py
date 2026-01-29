"""
License manager — issue, revoke, validate licenses per tenant/feature.
Canonical location: saas-layer/licensing. Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any
import time


@dataclass
class License:
    """A license: id, tenant_id, features, expires_at."""

    id: str
    tenant_id: str
    features: list[str] = field(default_factory=list)
    expires_at: float | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    def is_expired(self) -> bool:
        """True if past expires_at. Testable."""
        if self.expires_at is None:
            return False
        return time.time() >= self.expires_at


class LicenseManager:
    """
    License manager: issue, revoke, validate (tenant + feature).
    Testable.
    """

    def __init__(self) -> None:
        self._licenses: dict[str, License] = {}
        self._by_tenant: dict[str, list[str]] = {}

    def issue(
        self,
        license_id: str,
        tenant_id: str,
        features: list[str] | None = None,
        expires_at: float | None = None,
    ) -> License:
        """Issue license. Testable."""
        lic = License(
            id=license_id,
            tenant_id=tenant_id,
            features=features or [],
            expires_at=expires_at,
        )
        self._licenses[license_id] = lic
        self._by_tenant.setdefault(tenant_id, []).append(license_id)
        return lic

    def revoke(self, license_id: str) -> bool:
        """Revoke license. Returns True if found. Testable."""
        lic = self._licenses.pop(license_id, None)
        if lic is None:
            return False
        tenant_list = self._by_tenant.get(lic.tenant_id, [])
        if license_id in tenant_list:
            tenant_list.remove(license_id)
        return True

    def get(self, license_id: str) -> License | None:
        """Get license by id. Testable."""
        return self._licenses.get(license_id)

    def list_for_tenant(self, tenant_id: str) -> list[License]:
        """List licenses for tenant. Testable."""
        ids = self._by_tenant.get(tenant_id, [])
        return [self._licenses[i] for i in ids if i in self._licenses]

    def validate(self, tenant_id: str, feature: str) -> bool:
        """True if tenant has valid license including feature. Testable."""
        for lic in self.list_for_tenant(tenant_id):
            if lic.is_expired():
                continue
            if feature in lic.features:
                return True
        return False


def create_license_manager() -> LicenseManager:
    """Create license manager. Testable."""
    return LicenseManager()
