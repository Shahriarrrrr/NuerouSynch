from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow read-only access to anyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only allow authors to edit/delete
        return obj.author == request.user
