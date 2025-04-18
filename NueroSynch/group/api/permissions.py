from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in SAFE_METHODS:
            return True

        # Handle for Group objects
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user

        # Handle for GroupJoinRequest objects by checking group's creator
        if hasattr(obj, 'group') and hasattr(obj.group, 'created_by'):
            return obj.group.created_by == request.user

        # Default deny
        return False
