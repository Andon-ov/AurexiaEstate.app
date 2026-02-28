from django.contrib import admin
from .models import (
    Destination,
    PropertyFeature,
    Property,
    PropertyFeatureLink,
    PropertyImage,
    PropertyInquiry,
    InvestorListing,
    CacheSettingsProxy,
    ThemeSettingsProxy,
    ContactPageContentProxy,
)
from generix.api_generix.models import (
    CacheSettings,
    ThemeSettings,
    ContactPageContent,
)


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    """Admin interface for Destinations"""
    
    list_display = ['name_en', 'slug', 'is_featured', 'is_active', 'order', 'updated_at']
    list_filter = ['is_featured', 'is_active', 'created_at']
    search_fields = ['name_en', 'name_bg', 'slug']
    prepopulated_fields = {'slug': ('name_en',)}
    ordering = ['order', 'name_en']
    
    fieldsets = (
        ('English Content', {
            'fields': (
                'name_en',
                'short_description_en',
                'description_en',
                'meta_title_en',
                'meta_description_en'
            )
        }),
        ('Bulgarian Content', {
            'fields': (
                'name_bg',
                'short_description_bg',
                'description_bg'
            )
        }),
        ('Images', {
            'fields': ('hero_image', 'thumbnail_image')
        }),
        ('SEO & URL', {
            'fields': ('slug',)
        }),
        ('Settings', {
            'fields': ('is_featured', 'is_active', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PropertyFeature)
class PropertyFeatureAdmin(admin.ModelAdmin):
    """Admin interface for Property Features"""
    
    list_display = ['name_en', 'icon', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name_en', 'name_bg']
    ordering = ['order', 'name_en']
    
    fieldsets = (
        ('Feature Names', {
            'fields': ('name_en', 'name_bg')
        }),
        ('Icon', {
            'fields': ('icon',),
            'description': 'Font Awesome class (e.g., "fa-swimming-pool") or icon URL'
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


class PropertyImageInline(admin.TabularInline):
    """Inline admin for Property Images"""
    model = PropertyImage
    extra = 1
    fields = ['image', 'caption_en', 'caption_bg', 'order', 'is_active']
    ordering = ['order']


class PropertyFeatureLinkInline(admin.TabularInline):
    """Inline admin for Property Features"""
    model = PropertyFeatureLink
    extra = 1
    autocomplete_fields = ['feature']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """Admin interface for Properties"""
    
    list_display = [
        'title_en', 'destination', 'city', 'property_type', 
        'status', 'price', 'price_currency', 'bedrooms', 
        'is_featured', 'is_active', 'views_count'
    ]
    list_filter = [
        'destination', 'property_type', 'status', 
        'is_featured', 'is_active', 'created_at'
    ]
    search_fields = ['title_en', 'title_bg', 'city', 'address']
    prepopulated_fields = {'slug': ('title_en',)}
    ordering = ['-is_featured', 'order', '-created_at']
    inlines = [PropertyImageInline, PropertyFeatureLinkInline]
    
    fieldsets = (
        ('English Content', {
            'fields': (
                'title_en',
                'short_description_en',
                'description_en',
                'meta_title_en',
                'meta_description_en'
            )
        }),
        ('Bulgarian Content', {
            'fields': (
                'title_bg',
                'short_description_bg',
                'description_bg'
            )
        }),
        ('Property Details', {
            'fields': (
                'destination',
                'property_type',
                'status'
            )
        }),
        ('Pricing', {
            'fields': ('price', 'price_currency')
        }),
        ('Specifications', {
            'fields': (
                'bedrooms',
                'bathrooms',
                'area_sqm',
                'plot_size_sqm'
            )
        }),
        ('Location', {
            'fields': (
                'address',
                'city',
                'postal_code',
                'latitude',
                'longitude'
            )
        }),
        ('Media', {
            'fields': (
                'featured_image',
                'video_url',
                'virtual_tour_url'
            )
        }),
        ('SEO & URL', {
            'fields': ('slug',)
        }),
        ('Settings', {
            'fields': (
                'is_featured',
                'is_active',
                'order',
                'views_count',
                'published_at'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'views_count']
    autocomplete_fields = ['destination']


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    """Admin interface for Property Images"""
    
    list_display = ['property', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['property__title_en', 'caption_en']
    ordering = ['property', 'order']
    
    fieldsets = (
        ('Property', {
            'fields': ('property',)
        }),
        ('Image', {
            'fields': ('image',)
        }),
        ('Captions', {
            'fields': ('caption_en', 'caption_bg')
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
    autocomplete_fields = ['property']


@admin.register(PropertyInquiry)
class PropertyInquiryAdmin(admin.ModelAdmin):
    """Admin interface for Property Inquiries"""
    
    list_display = [
        'full_name', 'email', 'property', 
        'preferred_contact_method', 'is_contacted', 
        'created_at'
    ]
    list_filter = [
        'is_contacted', 'preferred_contact_method', 
        'created_at', 'property__destination'
    ]
    search_fields = [
        'full_name', 'email', 'phone', 
        'property__title_en', 'message'
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Property Reference', {
            'fields': ('property',)
        }),
        ('Contact Information', {
            'fields': (
                'full_name',
                'email',
                'phone',
                'preferred_contact_method'
            )
        }),
        ('Inquiry Details', {
            'fields': (
                'message',
                'budget_range'
            )
        }),
        ('Status & Follow-up', {
            'fields': (
                'is_contacted',
                'contacted_at',
                'notes'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['property']
    
    actions = ['mark_as_contacted']
    
    def mark_as_contacted(self, request, queryset):
        """Mark selected inquiries as contacted"""
        from django.utils import timezone
        updated = queryset.update(is_contacted=True, contacted_at=timezone.now())
        self.message_user(request, f'{updated} inquiries marked as contacted.')
    mark_as_contacted.short_description = "Mark as contacted"


@admin.register(InvestorListing)
class InvestorListingAdmin(admin.ModelAdmin):
    """Admin interface for Investor Listings"""
    
    list_display = [
        'company_name', 'contact_person', 'email', 
        'subscription_status', 'monthly_fee', 
        'properties_count', 'is_active'
    ]
    list_filter = [
        'subscription_status', 'is_active', 
        'created_at', 'subscription_start'
    ]
    search_fields = [
        'company_name', 'contact_person', 
        'email', 'phone'
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Company Information', {
            'fields': (
                'company_name',
                'contact_person',
                'email',
                'phone',
                'address'
            )
        }),
        ('Subscription Details', {
            'fields': (
                'subscription_status',
                'subscription_start',
                'subscription_end',
                'monthly_fee'
            )
        }),
        ('Statistics', {
            'fields': ('properties_count',)
        }),
        ('Notes & Settings', {
            'fields': (
                'notes',
                'is_active'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'properties_count']
    
    actions = ['activate_subscription', 'deactivate_subscription']
    
    def activate_subscription(self, request, queryset):
        """Activate selected investor subscriptions"""
        updated = queryset.update(subscription_status='active', is_active=True)
        self.message_user(request, f'{updated} investors activated.')
    activate_subscription.short_description = "Activate subscription"
    
    def deactivate_subscription(self, request, queryset):
        """Deactivate selected investor subscriptions"""
        updated = queryset.update(subscription_status='inactive')
        self.message_user(request, f'{updated} investors deactivated.')
    deactivate_subscription.short_description = "Deactivate subscription"


# =============================================================================
# Proxy Model Admin - CacheSettings, ThemeSettings, ContactPageContent
# =============================================================================

@admin.register(CacheSettingsProxy)
class CacheSettingsProxyAdmin(admin.ModelAdmin):
    """Admin interface for Cache Settings (Singleton)"""
    
    list_display = ['cache_enabled', 'cache_timeout', 'updated_at']
    
    fieldsets = (
        ('Cache Configuration', {
            'fields': ('cache_enabled', 'cache_timeout'),
            'description': 'Control API response caching for all content endpoints. Changes will clear all cached data.'
        }),
    )
    
    def has_add_permission(self, request):
        return not CacheSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False
    
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(ThemeSettingsProxy)
class ThemeSettingsProxyAdmin(admin.ModelAdmin):
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


@admin.register(ContactPageContentProxy)
class ContactPageContentProxyAdmin(admin.ModelAdmin):
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


# Configure admin site header  
admin.site.site_header = "Aurexia Estate Administration"
admin.site.site_title = "Aurexia Estate Admin"
admin.site.index_title = "Welcome to Aurexia Estate Admin Portal"
