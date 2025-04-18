from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from group.models import Group, GroupJoinRequest
from .serializers import GroupSerializer, GroupJoinRequestSerializer, GroupJoinRequestStatusUpdateSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .permissions import IsAuthorOrReadOnly
from django.db.models import Q


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly,IsAuthorOrReadOnly]
    print(permission_classes)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    # def get_queryset(self):
    #     # Optional: only show groups the user is a member of or created
    #     return Group.objects.filter(members=self.request.user) | Group.objects.filter(created_by=self.request.user)


class GroupJoinRequestViewSet(viewsets.ModelViewSet):
    queryset = GroupJoinRequest.objects.all()
    serializer_class = GroupJoinRequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly,IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if self.action == 'list':
            if user.is_authenticated:
                return GroupJoinRequest.objects.filter(
                    Q(requested_by=user) |
                    Q(group__created_by=user)
                ).distinct()
            return GroupJoinRequest.objects.none()
        return super().get_queryset()


    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        join_request = self.get_object()

        # Make sure only the group creator can approve/decline
        if join_request.group.created_by != request.user:
            return Response({"detail": "You are not authorized to approve/decline this request."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = GroupJoinRequestStatusUpdateSerializer(join_request, data=request.data, partial=True)
        if serializer.is_valid():
            new_status = serializer.validated_data['status']
            serializer.save()

            # Add to group members if approved
            if new_status == 'approved':
                join_request.group.members.add(join_request.requested_by)

            return Response({"detail": f"Request {new_status}."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)