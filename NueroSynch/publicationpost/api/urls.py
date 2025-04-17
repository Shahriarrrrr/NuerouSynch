from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicationPostViewSet

router = DefaultRouter()
router.register('posts', PublicationPostViewSet)

urlpatterns = [
    path('', include(router.urls)),
]