"""
Marketplace engine — list, install, and manage marketplace offerings.
Modular, testable.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Offering:
    """A marketplace offering: id, name, type, version, metadata."""

    id: str
    name: str
    type: str = "plugin"
    version: str = "1.0.0"
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class InstalledOffering:
    """Installed offering: offering_id, installed_version, tenant_id."""

    offering_id: str
    installed_version: str
    tenant_id: str = ""


class MarketplaceEngine:
    """
    Marketplace: add offering, list, install (record), uninstall.
    Testable.
    """

    def __init__(self) -> None:
        self._offerings: dict[str, Offering] = {}
        self._installed: list[InstalledOffering] = []

    def add_offering(self, offering: Offering) -> None:
        """Add offering to marketplace. Testable."""
        self._offerings[offering.id] = offering

    def get_offering(self, offering_id: str) -> Offering | None:
        """Get offering by id. Testable."""
        return self._offerings.get(offering_id)

    def list_offerings(self, type_filter: str | None = None) -> list[Offering]:
        """List offerings; optional type filter. Testable."""
        if type_filter is None:
            return list(self._offerings.values())
        return [o for o in self._offerings.values() if o.type == type_filter]

    def install(self, offering_id: str, tenant_id: str = "", version: str | None = None) -> bool:
        """Install offering for tenant. Returns True if offering exists. Testable."""
        offering = self._offerings.get(offering_id)
        if offering is None:
            return False
        self._installed.append(
            InstalledOffering(
                offering_id=offering_id,
                installed_version=version or offering.version,
                tenant_id=tenant_id,
            )
        )
        return True

    def uninstall(self, offering_id: str, tenant_id: str = "") -> bool:
        """Uninstall offering. Returns True if was installed. Testable."""
        for i, inst in enumerate(self._installed):
            if inst.offering_id == offering_id and inst.tenant_id == tenant_id:
                self._installed.pop(i)
                return True
        return False

    def list_installed(self, tenant_id: str | None = None) -> list[InstalledOffering]:
        """List installed offerings; optional tenant filter. Testable."""
        if tenant_id is None:
            return list(self._installed)
        return [i for i in self._installed if i.tenant_id == tenant_id]


def create_marketplace_engine() -> MarketplaceEngine:
    """Create marketplace engine. Testable."""
    return MarketplaceEngine()
