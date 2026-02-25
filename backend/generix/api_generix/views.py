from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.cache import cache
from .models import (
    CacheSettings,
    HeroSlide,
    Achievement,
    Partner,
    AboutUsTestimonial,
    CallToAction,
    ThemeSettings,
    TestimonialCard,
    ContactPageContent
)
from .serializers import (
    CacheSettingsSerializer,
    HeroSlideSerializer,
    AchievementSerializer,
    PartnerSerializer,
    AboutUsTestimonialSerializer,
    CallToActionSerializer,
    ThemeSettingsSerializer,
    TestimonialCardSerializer,
    ContactPageContentSerializer
)
from .cache_utils import cached_api_view


class CacheSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Cache Settings (Read-only, singleton)
    """
    queryset = CacheSettings.objects.all()
    serializer_class = CacheSettingsSerializer
    permission_classes = [AllowAny]
    
    def list(self, request):
        """Return the singleton cache settings instance"""
        settings = CacheSettings.load()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)


class HeroSlideViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Hero Slides
    Returns only active slides, ordered by 'order' field
    """
    queryset = HeroSlide.objects.filter(is_active=True).order_by('order')
    serializer_class = HeroSlideSerializer
    permission_classes = [AllowAny]
    
    @cached_api_view()
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Achievements/Statistics
    Returns only active achievements, ordered by 'order' field
    """
    queryset = Achievement.objects.filter(is_active=True).order_by('order')
    serializer_class = AchievementSerializer
    permission_classes = [AllowAny]
    
    @cached_api_view()
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class PartnerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Partner Logos
    Returns only active partners, ordered by 'order' field
    """
    queryset = Partner.objects.filter(is_active=True).order_by('order')
    serializer_class = PartnerSerializer
    permission_classes = [AllowAny]
    
    @cached_api_view()
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class AboutUsTestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for About Us Testimonial (singleton)
    """
    queryset = AboutUsTestimonial.objects.all()
    serializer_class = AboutUsTestimonialSerializer
    permission_classes = [AllowAny]
    
    @cached_api_view()
    def list(self, request):
        """Return the singleton testimonial instance"""
        testimonial = AboutUsTestimonial.load()
        serializer = self.get_serializer(testimonial)
        return Response(serializer.data)


class CallToActionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Call-to-Action sections
    Returns only active CTAs, ordered by 'order' field
    """
    queryset = CallToAction.objects.filter(is_active=True).order_by('order')
    serializer_class = CallToActionSerializer
    permission_classes = [AllowAny]
    
    @cached_api_view()
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @cached_api_view()
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class ThemeSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Theme Settings (singleton)
    Returns Aurexia Estate theme configuration
    """
    queryset = ThemeSettings.objects.all()
    serializer_class = ThemeSettingsSerializer
    permission_classes = [AllowAny]
    
    @cached_api_view()
    def list(self, request):
        """Return the singleton theme settings instance"""
        theme = ThemeSettings.load()
        serializer = self.get_serializer(theme)
        return Response(serializer.data)


class TestimonialCardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Testimonial Cards
    Returns only active testimonials, ordered by 'order' field
    """
    queryset = TestimonialCard.objects.filter(is_active=True).order_by('order')
    serializer_class = TestimonialCardSerializer
    permission_classes = [AllowAny]
    
    @cached_api_view()
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ContactPageContentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Contact Page Content (singleton)
    """
    queryset = ContactPageContent.objects.all()
    serializer_class = ContactPageContentSerializer
    permission_classes = [AllowAny]
    
    @cached_api_view()
    def list(self, request):
        """Return the singleton contact page content instance"""
        content = ContactPageContent.load()
        serializer = self.get_serializer(content)
        return Response(serializer.data)
