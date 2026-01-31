"""
Auth service — authentication and RBAC (roles, permissions).
Re-exports from auth package. Use: from auth_service import AuthService, Principal, create_auth_service.
"""
from auth.auth_service import (
    AuthResult,
    Principal,
    AuthService,
    create_auth_service,
)

__all__ = ["AuthResult", "Principal", "AuthService", "create_auth_service"]
