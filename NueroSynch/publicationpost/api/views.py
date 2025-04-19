from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

from publicationpost.models import PublicationPost
from .serializers import PublicationPostSerializer
from .permissions import IsAuthorOrReadOnly

# Filter to allow filtering by author (used for profile view)
class PublicationPostFilter(django_filters.FilterSet):
    author = django_filters.CharFilter(field_name='author__id', lookup_expr='exact')

    class Meta:
        model = PublicationPost
        fields = ['author']

class PublicationPostViewSet(viewsets.ModelViewSet):
    queryset = PublicationPost.objects.all()
    serializer_class = PublicationPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PublicationPostFilter

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# ViewSet for profile page (only current user's posts)
class UserPublicationPostViewSet(viewsets.ModelViewSet):
    serializer_class = PublicationPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        return PublicationPost.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
# from rest_framework import viewsets
# from publicationpost.models import PublicationPost
# from .serializers import PublicationPostSerializer
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.permissions import IsAuthenticatedOrReadOnly
# from .permissions import IsAuthorOrReadOnly


# class PublicationPostViewSet(viewsets.ModelViewSet):
#     queryset = PublicationPost.objects.all()
#     serializer_class = PublicationPostSerializer
#     permission_classes = [IsAuthenticatedOrReadOnly,IsAuthorOrReadOnly]





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
    