from rest_framework import permissions
from .models import Role

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role and request.user.role.name == Role.ADMIN)

class IsOfficerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role and request.user.role.name == Role.OFFICER)

class IsEmployeeUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role and request.user.role.name == Role.EMPLOYEE)

class IsAdminOrOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) and request.user.role.name in [Role.ADMIN, Role.OFFICER])
