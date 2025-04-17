from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GroupViewSet, GroupJoinRequestViewSet

router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'group-requests', GroupJoinRequestViewSet, basename='group-request')

urlpatterns = [
    path('', include(router.urls)),
]