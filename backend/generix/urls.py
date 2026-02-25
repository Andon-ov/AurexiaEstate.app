"""
URL configuration for generix project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import JsonResponse


def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        'message': 'Welcome to Aurexia Estate API',
        'version': '2.0',
        'endpoints': {
            'auth': '/api/auth/',
            'generix': '/api/generix/',
            'aurexia': '/api/aurexia/',
            'admin': '/admin/',
        }
    })


api_patterns = [
    path('', api_root, name='api-root'),
    path('auth/', include('generix.api_auth.urls')),
    path('generix/', include('generix.api_generix.urls')),
    path('aurexia/', include('generix.api_aurexia.urls')),
    path('drf-auth/', include('rest_framework.urls')), 
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_patterns)),
]

# Serve media files in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Note: In development, Angular runs on its own dev server (ng serve on port 4200)
# The catch-all route for Angular SPA is only needed in production when serving
# the built Angular app from Django. For now, we comment it out:
#
# if settings.DEBUG:
#     urlpatterns += [
#         re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
#     ]
