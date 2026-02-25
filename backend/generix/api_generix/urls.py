from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'cache-settings', views.CacheSettingsViewSet, basename='cache-settings')
router.register(r'hero-slides', views.HeroSlideViewSet, basename='hero-slides')
router.register(r'achievements', views.AchievementViewSet, basename='achievements')
router.register(r'partners', views.PartnerViewSet, basename='partners')
router.register(r'about-testimonial', views.AboutUsTestimonialViewSet, basename='about-testimonial')
router.register(r'cta', views.CallToActionViewSet, basename='cta')
router.register(r'theme-settings', views.ThemeSettingsViewSet, basename='theme-settings')
router.register(r'testimonials', views.TestimonialCardViewSet, basename='testimonials')
router.register(r'contact-page', views.ContactPageContentViewSet, basename='contact-page')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]
