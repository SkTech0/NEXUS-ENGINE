"""
License manager — issue, revoke, validate licenses per tenant/feature.
Re-exports from licensing package.
"""
from licensing.license_manager import (
    License,
    LicenseManager,
    create_license_manager,
)

__all__ = ["License", "LicenseManager", "create_license_manager"]
