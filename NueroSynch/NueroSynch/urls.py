from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/api/', include('accounts.api.urls')),
    path('post/api/', include('publicationpost.api.urls')),
    path('login/', include('accounts.api.urls')),
    path('group/api/', include('group.api.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)