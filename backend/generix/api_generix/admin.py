from django.contrib import admin
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


@admin.register(CacheSettings)
class CacheSettingsAdmin(admin.ModelAdmin):
    """Admin interface for Cache Settings (Singleton)"""
    
    list_display = ['cache_enabled', 'cache_timeout', 'updated_at']
    
    fieldsets = (
        ('Cache Configuration', {
            'fields': ('cache_enabled', 'cache_timeout'),
            'description': 'Control API response caching for all content endpoints. Changes will clear all cached data.'
        }),
    )
    
    def has_add_permission(self, request):
        # Allow only if no instance exists
        return not CacheSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion
        return False
    
    def get_actions(self, request):
        # Remove bulk delete action
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    """Admin interface for Hero Slides"""
    
    list_display = ['title_en', 'title_bg', 'button_link', 'order', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title_en', 'title_bg', 'description_en', 'description_bg']
    ordering = ['order', 'id']
    
    fieldsets = (
        ('English Content', {
            'fields': (
                'title_en',
                'description_en',
                'button_text_en'
            ),
            'description': 'English translations for hero slide'
        }),
        ('Bulgarian Content', {
            'fields': (
                'title_bg',
                'description_bg',
                'button_text_bg'
            ),
            'description': 'Български преводи за hero слайда'
        }),
        ('Media & Link', {
            'fields': ('background_image', 'button_link')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_changeform_initial_data(self, request):
        return {
            'order': 0,
            'is_active': True
        }


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """Admin interface for Achievements & Statistics"""
    
    list_display = ['title_en', 'title_bg', 'count', 'order', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title_en', 'title_bg']
    ordering = ['order', 'id']
    
    fieldsets = (
        ('English Content', {
            'fields': ('title_en',),
            'description': 'English translation for achievement title'
        }),
        ('Bulgarian Content', {
            'fields': ('title_bg',),
            'description': 'Български превод за заглавието'
        }),
        ('Value', {
            'fields': ('count',),
            'description': 'Display value (e.g., "50+ Properties", "€200M+ Portfolio", "5 Countries")'
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_changeform_initial_data(self, request):
        return {
            'order': 0,
            'is_active': True
        }


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    """Admin interface for Partners"""
    
    list_display = ['name', 'logo_url', 'order', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']
    ordering = ['order', 'id']
    
    fieldsets = (
        ('Partner Info', {
            'fields': ('name', 'logo_url'),
            'description': 'Partner company name and logo URL (banks, brokers, luxury brands)'
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_changeform_initial_data(self, request):
        return {
            'order': 0,
            'is_active': True
        }


@admin.register(AboutUsTestimonial)
class AboutUsTestimonialAdmin(admin.ModelAdmin):
    """Admin interface for About Us Testimonial (Singleton)"""
    
    list_display = ['author_name_en', 'author_title_en', 'updated_at']
    
    fieldsets = (
        ('Main Quote', {
            'fields': ('quote_en', 'quote_bg'),
            'description': 'Main testimonial quote in both languages'
        }),
        ('Author Information - English', {
            'fields': (
                'author_name_en',
                'author_title_en',
                'author_quote_en'
            )
        }),
        ('Author Information - Bulgarian', {
            'fields': (
                'author_name_bg',
                'author_title_bg',
                'author_quote_bg'
            )
        }),
        ('Author Image', {
            'fields': ('author_image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def has_add_permission(self, request):
        return not AboutUsTestimonial.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False
    
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(CallToAction)
class CallToActionAdmin(admin.ModelAdmin):
    """Admin interface for Call-to-Action sections"""
    
    list_display = ['name', 'title_en', 'style', 'button_link', 'order', 'is_active', 'updated_at']
    list_filter = ['is_active', 'style', 'created_at']
    search_fields = ['name', 'title_en', 'title_bg', 'description_en']
    ordering = ['order', 'id']
    
    fieldsets = (
        ('Identification', {
            'fields': ('name',),
            'description': 'Internal name for this CTA (e.g., "Home Page CTA", "About Page CTA")'
        }),
        ('English Content', {
            'fields': (
                'title_en',
                'description_en',
                'button_text_en'
            )
        }),
        ('Bulgarian Content', {
            'fields': (
                'title_bg',
                'description_bg',
                'button_text_bg'
            )
        }),
        ('Link & Style', {
            'fields': ('button_link', 'style')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_changeform_initial_data(self, request):
        return {
            'order': 0,
            'is_active': True,
            'style': 'gradient',
            'button_link': '/contact'
        }


@admin.register(ThemeSettings)
class ThemeSettingsAdmin(admin.ModelAdmin):
    """Admin interface for Aurexia Estate Theme Settings (Singleton)"""
    
    list_display = ['__str__', 'color_primary', 'color_accent_gold', 'updated_at']
    
    fieldsets = (
        ('Aurexia Brand Colors', {
            'fields': (
                'color_primary',
                'color_surface',
                'color_accent_gold',
                'color_accent_gold_hover'
            ),
            'description': 'Primary dark luxury theme colors'
        }),
        ('Text Colors', {
            'fields': (
                'color_text_primary',
                'color_text_secondary',
                'color_text_muted'
            )
        }),
        ('Semantic Colors', {
            'fields': (
                'color_success',
                'color_warning',
                'color_error',
                'color_info'
            ),
            'classes': ('collapse',)
        }),
        ('Additional UI Colors', {
            'fields': (
                'color_white',
                'color_black',
                'color_border',
                'color_overlay'
            ),
            'classes': ('collapse',)
        }),
        ('Typography', {
            'fields': (
                'font_heading',
                'font_body'
            ),
            'description': 'Font families for headings and body text'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def has_add_permission(self, request):
        return not ThemeSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False
    
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(TestimonialCard)
class TestimonialCardAdmin(admin.ModelAdmin):
    """Admin interface for Testimonial Cards"""
    
    list_display = ['name_en', 'role', 'order', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name_en', 'name_bg', 'description_en', 'role']
    ordering = ['order', 'id']
    
    fieldsets = (
        ('Logo/Avatar', {
            'fields': ('logo_url',),
            'description': 'URL to company logo or client avatar'
        }),
        ('English Content', {
            'fields': (
                'name_en',
                'description_en'
            )
        }),
        ('Bulgarian Content', {
            'fields': (
                'name_bg',
                'description_bg'
            )
        }),
        ('Additional Info', {
            'fields': ('role',),
            'description': 'Optional: Role or company type (e.g., "Property Investor")'
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_changeform_initial_data(self, request):
        return {
            'order': 0,
            'is_active': True
        }


@admin.register(ContactPageContent)
class ContactPageContentAdmin(admin.ModelAdmin):
    """Admin interface for Contact Page Content (Singleton)"""
    
    list_display = ['hero_title_en', 'email', 'phone', 'updated_at']
    
    fieldsets = (
        ('Hero Section - English', {
            'fields': ('hero_title_en',)
        }),
        ('Hero Section - Bulgarian', {
            'fields': ('hero_title_bg',)
        }),
        ('Contact Section - English', {
            'fields': (
                'title_en',
                'subtitle_en',
                'address_line1_en',
                'address_line2_en'
            )
        }),
        ('Contact Section - Bulgarian', {
            'fields': (
                'title_bg',
                'subtitle_bg',
                'address_line1_bg',
                'address_line2_bg'
            )
        }),
        ('Contact Details', {
            'fields': ('email', 'phone')
        }),
        ('Timestamps', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['updated_at']
    
    def has_add_permission(self, request):
        return not ContactPageContent.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False
    
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions
