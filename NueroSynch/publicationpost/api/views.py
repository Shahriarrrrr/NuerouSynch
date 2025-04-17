from rest_framework import viewsets
from publicationpost.models import PublicationPost
from .serializers import PublicationPostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .permissions import IsAuthorOrReadOnly


class PublicationPostViewSet(viewsets.ModelViewSet):
    queryset = PublicationPost.objects.all()
    serializer_class = PublicationPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly,IsAuthorOrReadOnly]





# class PublicationPostViewSet(viewsets.ModelViewSet):
#     queryset = PublicationPost.objects.all()
#     serializer_class = PublicationPostSerializer
#     permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

#     def perform_create(self, serializer):
#         serializer.save(author=self.request.user)

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = CustomUser.objects.all()
#     serializer_class = UserSerializer
#     #permission_classes = [IsAuthenticatedOrReadOnly]
    