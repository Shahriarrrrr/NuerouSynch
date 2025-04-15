from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/api/', include('accounts.api.urls')),
    path('post/api/', include('publicationpost.api.urls'))
]
