from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicationPostViewSet,UserPublicationPostViewSet

router = DefaultRouter()
router.register('posts', PublicationPostViewSet)
router.register(r'my-posts', UserPublicationPostViewSet, basename='user-posts')

urlpatterns = [
    path('', include(router.urls)),
]