from rest_framework import serializers
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


class CacheSettingsSerializer(serializers.ModelSerializer):
    """Serializer for Cache Settings"""
    
    class Meta:
        model = CacheSettings
        fields = ['cache_enabled', 'cache_timeout', 'updated_at']
        read_only_fields = ['updated_at']


class HeroSlideSerializer(serializers.ModelSerializer):
    """Serializer for Hero Slides"""
    
    class Meta:
        model = HeroSlide
        fields = [
            'id', 
            'title_en', 'title_bg',
            'description_en', 'description_bg',
            'button_text_en', 'button_text_bg',
            'button_link',
            'background_image',
            'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for Achievements/Statistics"""
    
    class Meta:
        model = Achievement
        fields = [
            'id',
            'title_en', 'title_bg',
            'count',
            'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PartnerSerializer(serializers.ModelSerializer):
    """Serializer for Partner Logos"""
    
    class Meta:
        model = Partner
        fields = [
            'id',
            'name',
            'logo_url',
            'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AboutUsTestimonialSerializer(serializers.ModelSerializer):
    """Serializer for About Us Testimonial"""
    
    class Meta:
        model = AboutUsTestimonial
        fields = [
            'id',
            'quote_en', 'quote_bg',
            'author_name_en', 'author_name_bg',
            'author_title_en', 'author_title_bg',
            'author_quote_en', 'author_quote_bg',
            'author_image',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class CallToActionSerializer(serializers.ModelSerializer):
    """Serializer for Call-to-Action sections"""
    
    class Meta:
        model = CallToAction
        fields = [
            'id',
            'name',
            'title_en', 'title_bg',
            'description_en', 'description_bg',
            'button_text_en', 'button_text_bg',
            'button_link',
            'style',
            'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ThemeSettingsSerializer(serializers.ModelSerializer):
    """Serializer for Theme Settings"""
    
    class Meta:
        model = ThemeSettings
        fields = [
            'id',
            # Brand colors
            'color_primary',
            'color_surface',
            'color_accent_gold',
            'color_accent_gold_hover',
            # Text colors
            'color_text_primary',
            'color_text_secondary',
            'color_text_muted',
            # Semantic colors
            'color_success',
            'color_warning',
            'color_error',
            'color_info',
            # UI colors
            'color_white',
            'color_black',
            'color_border',
            'color_overlay',
            # Typography
            'font_heading',
            'font_body',
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class TestimonialCardSerializer(serializers.ModelSerializer):
    """Serializer for Testimonial Cards"""
    
    class Meta:
        model = TestimonialCard
        fields = [
            'id',
            'logo_url',
            'name_en', 'name_bg',
            'description_en', 'description_bg',
            'role',
            'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ContactPageContentSerializer(serializers.ModelSerializer):
    """Serializer for Contact Page Content"""
    
    class Meta:
        model = ContactPageContent
        fields = [
            'id',
            'hero_title_en', 'hero_title_bg',
            'title_en', 'title_bg',
            'subtitle_en', 'subtitle_bg',
            'address_line1_en', 'address_line1_bg',
            'address_line2_en', 'address_line2_bg',
            'email', 'phone',
            'updated_at'
        ]
        read_only_fields = ['updated_at']
