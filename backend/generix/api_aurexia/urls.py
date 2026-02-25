from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'destinations', views.DestinationViewSet, basename='destinations')
router.register(r'features', views.PropertyFeatureViewSet, basename='features')
router.register(r'properties', views.PropertyViewSet, basename='properties')
router.register(r'inquiries', views.PropertyInquiryViewSet, basename='inquiries')
router.register(r'investors', views.InvestorListingViewSet, basename='investors')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]
