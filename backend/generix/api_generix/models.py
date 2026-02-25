from django.db import models
from django.core.cache import cache


class CacheSettings(models.Model):
    """
    Global cache settings (singleton model)
    Controls API response caching for all content endpoints
    """
    cache_enabled = models.BooleanField(
        default=True,
        verbose_name="Enable Cache",
        help_text="Enable/disable API response caching globally"
    )
    cache_timeout = models.IntegerField(
        default=1800,
        verbose_name="Cache Timeout (seconds)",
        help_text="Cache duration in seconds (default: 1800 = 30 minutes)"
    )
    
    # Timestamps
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Cache Settings"
        verbose_name_plural = "Cache Settings"
    
    def __str__(self):
        status = "Enabled" if self.cache_enabled else "Disabled"
        return f"Cache Settings ({status}, {self.cache_timeout}s)"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)
        
        # Clear all cache when settings change
        cache.clear()
    
    def delete(self, *args, **kwargs):
        # Prevent deletion
        pass
    
    @classmethod
    def load(cls):
        """Get or create singleton instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class HeroSlide(models.Model):
    """
    Hero slider slides for home page
    Maximum 5 slides with EN/BG translations
    """
    # English
    title_en = models.CharField(
        max_length=200,
        verbose_name="Title (English)",
        help_text="Slide title in English"
    )
    description_en = models.TextField(
        verbose_name="Description (English)",
        help_text="Slide description in English"
    )
    button_text_en = models.CharField(
        max_length=100,
        verbose_name="Button Text (English)",
        help_text="Call-to-action button text in English"
    )
    
    # Bulgarian
    title_bg = models.CharField(
        max_length=200,
        verbose_name="Заглавие (Български)",
        help_text="Заглавие на слайда на български"
    )
    description_bg = models.TextField(
        verbose_name="Описание (Български)",
        help_text="Описание на слайда на български"
    )
    button_text_bg = models.CharField(
        max_length=100,
        verbose_name="Текст на бутон (Български)",
        help_text="Текст на бутона на български"
    )
    
    # Common fields
    button_link = models.CharField(
        max_length=200,
        verbose_name="Button Link",
        help_text="URL or Angular route (e.g., /properties or https://example.com)"
    )
    background_image = models.URLField(
        verbose_name="Background Image URL",
        help_text="Cloudinary or external image URL for slide background"
    )
    
    # Metadata
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order (lower numbers appear first)"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
        help_text="Show this slide in the hero slider"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Hero Slide"
        verbose_name_plural = "Hero Slides"
    
    def __str__(self):
        return f"{self.title_en} (Order: {self.order})"


class Achievement(models.Model):
    """
    Achievements/Statistics section
    3-4 statistics: properties sold, clients served, countries, portfolio value, etc.
    """
    # English
    title_en = models.CharField(
        max_length=200,
        verbose_name="Title (English)",
        help_text="Achievement title in English (e.g., 'Properties Sold', 'Happy Clients')"
    )
    
    # Bulgarian
    title_bg = models.CharField(
        max_length=200,
        verbose_name="Заглавие (Български)",
        help_text="Заглавие на постижението на български"
    )
    
    # Common fields
    count = models.CharField(
        max_length=50,
        verbose_name="Count/Value",
        help_text="Display value (e.g., '50+', '€200M+', '5 Countries')"
    )
    
    # Metadata
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order (lower numbers appear first)"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
        help_text="Show this achievement on the website"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Achievement"
        verbose_name_plural = "Achievements"
    
    def __str__(self):
        return f"{self.title_en}: {self.count}"


class Partner(models.Model):
    """
    Partner logos for carousel
    Partners: banks, brokers, luxury brands, developers
    """
    name = models.CharField(
        max_length=200,
        verbose_name="Partner Name",
        help_text="Name of the partner/client company"
    )
    logo_url = models.URLField(
        verbose_name="Logo URL",
        help_text="URL to partner logo (Cloudinary or external)"
    )
    
    # Metadata
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order in carousel"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
        help_text="Show this partner logo in the carousel"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Partner Logo"
        verbose_name_plural = "Partner Logos"
    
    def __str__(self):
        return self.name


class AboutUsTestimonial(models.Model):
    """
    About Us testimonial section for home/about page
    Singleton - only one testimonial can exist
    """
    # Main quote
    quote_en = models.TextField(
        verbose_name="Quote (English)",
        help_text="Main testimonial quote in English"
    )
    quote_bg = models.TextField(
        verbose_name="Цитат (Български)",
        help_text="Главен цитат на български"
    )
    
    # Author information
    author_name_en = models.CharField(
        max_length=200,
        verbose_name="Author Name (English)",
        help_text="Author's full name in English"
    )
    author_name_bg = models.CharField(
        max_length=200,
        verbose_name="Име на автор (Български)",
        help_text="Пълно име на автора на български"
    )
    
    author_title_en = models.CharField(
        max_length=200,
        verbose_name="Author Title (English)",
        help_text="Author's position/title in English (e.g., 'CEO & Founder')"
    )
    author_title_bg = models.CharField(
        max_length=200,
        verbose_name="Позиция (Български)",
        help_text="Позиция/титла на автора на български"
    )
    
    author_quote_en = models.TextField(
        verbose_name="Author Quote (English)",
        help_text="Short quote from author in English"
    )
    author_quote_bg = models.TextField(
        verbose_name="Цитат на автор (Български)",
        help_text="Кратък цитат от автора на български"
    )
    
    # Author image
    author_image = models.URLField(
        verbose_name="Author Image URL",
        help_text="URL to author's profile image"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "About Us Testimonial"
        verbose_name_plural = "About Us Testimonial"
    
    def __str__(self):
        return f"About Us Testimonial - {self.author_name_en}"
    
    def save(self, *args, **kwargs):
        """Ensure only one instance exists (singleton pattern)"""
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        """Prevent deletion of the singleton instance"""
        pass
    
    @classmethod
    def load(cls):
        """Get or create the singleton instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class CallToAction(models.Model):
    """
    Reusable Call-to-Action sections
    Multiple CTAs for different pages
    """
    # Internal name for admin identification
    name = models.CharField(
        max_length=100,
        verbose_name="CTA Name",
        help_text="Internal name for identification (e.g., 'Home CTA', 'About Page CTA')"
    )
    
    # English
    title_en = models.CharField(
        max_length=200,
        verbose_name="Title (English)",
        help_text="CTA title in English"
    )
    description_en = models.TextField(
        verbose_name="Description (English)",
        help_text="CTA description in English"
    )
    button_text_en = models.CharField(
        max_length=100,
        verbose_name="Button Text (English)",
        help_text="Button text in English",
        default="Contact Us"
    )
    
    # Bulgarian
    title_bg = models.CharField(
        max_length=200,
        verbose_name="Заглавие (Български)",
        help_text="Заглавие на CTA на български"
    )
    description_bg = models.TextField(
        verbose_name="Описание (Български)",
        help_text="Описание на CTA на български"
    )
    button_text_bg = models.CharField(
        max_length=100,
        verbose_name="Текст на бутон (Български)",
        help_text="Текст на бутона на български",
        default="Свържете се с нас"
    )
    
    # Common fields
    button_link = models.CharField(
        max_length=200,
        verbose_name="Button Link",
        help_text="URL or Angular route (e.g., /contact)",
        default="/contact"
    )
    
    # Style options
    style = models.CharField(
        max_length=20,
        choices=[
            ('gradient', 'Gradient Background'),
            ('dark', 'Dark Background'),
            ('light', 'Light Background'),
        ],
        default='gradient',
        verbose_name="Style",
        help_text="Visual style of the CTA section"
    )
    
    # Metadata
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order (lower numbers appear first)"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
        help_text="Show this CTA on the website"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Call-to-Action"
        verbose_name_plural = "Call-to-Actions"
    
    def __str__(self):
        return f"{self.name} - {self.title_en}"


class ThemeSettings(models.Model):
    """
    Theme Settings for Aurexia Estate - ultra-luxury dark theme
    Singleton - only one theme configuration
    """
    # Aurexia Brand Colors - Dark Luxury Theme
    color_primary = models.CharField(
        max_length=7,
        default='#0a0a0a',
        verbose_name="Primary Color",
        help_text="Primary dark color (e.g., #0a0a0a) - Deep black for backgrounds"
    )
    color_surface = models.CharField(
        max_length=7,
        default='#1a1a1a',
        verbose_name="Surface Color",
        help_text="Surface color (e.g., #1a1a1a) - Elevated surfaces and cards"
    )
    color_accent_gold = models.CharField(
        max_length=7,
        default='#c9a84c',
        verbose_name="Accent Gold",
        help_text="Royal gold accent (e.g., #c9a84c) - Buttons, highlights, borders"
    )
    color_accent_gold_hover = models.CharField(
        max_length=7,
        default='#b39440',
        verbose_name="Gold Hover",
        help_text="Darker gold for hover states (e.g., #b39440)"
    )
    
    # Text Colors
    color_text_primary = models.CharField(
        max_length=7,
        default='#ffffff',
        verbose_name="Primary Text",
        help_text="Primary text color (e.g., #ffffff) - White for dark backgrounds"
    )
    color_text_secondary = models.CharField(
        max_length=7,
        default='#a0a0a0',
        verbose_name="Secondary Text",
        help_text="Secondary text color (e.g., #a0a0a0) - Light gray for descriptions"
    )
    color_text_muted = models.CharField(
        max_length=7,
        default='#6b7280',
        verbose_name="Muted Text",
        help_text="Muted text color (e.g., #6b7280) - For labels and captions"
    )
    
    # Semantic Colors
    color_success = models.CharField(
        max_length=7,
        default='#10b981',
        verbose_name="Success Color",
        help_text="Green for success messages"
    )
    color_warning = models.CharField(
        max_length=7,
        default='#f59e0b',
        verbose_name="Warning Color",
        help_text="Orange for warnings"
    )
    color_error = models.CharField(
        max_length=7,
        default='#ef4444',
        verbose_name="Error Color",
        help_text="Red for errors"
    )
    color_info = models.CharField(
        max_length=7,
        default='#3b82f6',
        verbose_name="Info Color",
        help_text="Blue for info messages"
    )
    
    # Additional UI Colors
    color_white = models.CharField(
        max_length=7,
        default='#ffffff',
        verbose_name="White",
        help_text="Pure white"
    )
    color_black = models.CharField(
        max_length=7,
        default='#000000',
        verbose_name="Black",
        help_text="Pure black"
    )
    color_border = models.CharField(
        max_length=7,
        default='#2a2a2a',
        verbose_name="Border Color",
        help_text="Subtle border for dark theme (e.g., #2a2a2a)"
    )
    color_overlay = models.CharField(
        max_length=9,
        default='#00000080',
        verbose_name="Overlay Color",
        help_text="Semi-transparent overlay (e.g., #00000080) - with alpha channel"
    )
    
    # Typography Settings
    font_heading = models.CharField(
        max_length=100,
        default='Cormorant Garamond',
        verbose_name="Heading Font",
        help_text="Font family for headings (e.g., 'Cormorant Garamond')"
    )
    font_body = models.CharField(
        max_length=100,
        default='Montserrat',
        verbose_name="Body Font",
        help_text="Font family for body text (e.g., 'Montserrat')"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Theme Settings"
        verbose_name_plural = "Theme Settings"
    
    def __str__(self):
        return f"Aurexia Theme Settings (Updated: {self.updated_at.strftime('%Y-%m-%d %H:%M')})"
    
    def save(self, *args, **kwargs):
        """Ensure only one instance exists (singleton pattern)"""
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        """Prevent deletion of the singleton instance"""
        pass
    
    @classmethod
    def load(cls):
        """Get or create the singleton instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class TestimonialCard(models.Model):
    """
    Testimonial cards for testimonials slider
    Reviews from buyers, investors, partners
    """
    # Logo/Avatar
    logo_url = models.URLField(
        verbose_name="Logo/Avatar URL",
        help_text="URL to company logo or client avatar image"
    )
    
    # English
    name_en = models.CharField(
        max_length=200,
        verbose_name="Name (English)",
        help_text="Person or company name in English"
    )
    description_en = models.TextField(
        verbose_name="Testimonial (English)",
        help_text="Testimonial text in English"
    )
    
    # Bulgarian
    name_bg = models.CharField(
        max_length=200,
        verbose_name="Име (Български)",
        help_text="Име на лице или компания на български"
    )
    description_bg = models.TextField(
        verbose_name="Отзив (Български)",
        help_text="Текст на отзива на български"
    )
    
    # Additional info (optional)
    role = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Role/Position",
        help_text="Optional: Person's role or company type (e.g., 'Property Investor', 'Real Estate Developer')"
    )
    
    # Metadata
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order (lower numbers appear first)"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
        help_text="Show this testimonial in slider"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"
        ordering = ['order', 'id']
    
    def __str__(self):
        return f"Testimonial - {self.name_en}"


class ContactPageContent(models.Model):
    """
    Contact page content singleton
    Singleton - only one record can exist
    """
    # English
    hero_title_en = models.CharField(
        max_length=200,
        verbose_name="Hero Title (English)",
        help_text="Main hero section title in English",
        default="Get in Touch"
    )
    title_en = models.CharField(
        max_length=200,
        verbose_name="Section Title (English)",
        help_text="Contact section title in English",
        default="Contact Information"
    )
    subtitle_en = models.TextField(
        verbose_name="Subtitle (English)",
        help_text="Contact section subtitle in English",
        default="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
    )
    address_line1_en = models.CharField(
        max_length=200,
        verbose_name="Address Line 1 (English)",
        help_text="First line of address in English",
        default="Luxury Office Complex"
    )
    address_line2_en = models.CharField(
        max_length=200,
        verbose_name="Address Line 2 (English)",
        help_text="Second line of address in English",
        default="Sofia, Bulgaria"
    )
    
    # Bulgarian
    hero_title_bg = models.CharField(
        max_length=200,
        verbose_name="Hero заглавие (Български)",
        help_text="Главно hero заглавие на български",
        default="Свържете се с нас"
    )
    title_bg = models.CharField(
        max_length=200,
        verbose_name="Заглавие на секция (Български)",
        help_text="Заглавие на контакт секцията на български",
        default="Информация за контакт"
    )
    subtitle_bg = models.TextField(
        verbose_name="Подзаглавие (Български)",
        help_text="Подзаглавие на контакт секцията на български",
        default="Ще се радваме да чуем от вас. Изпратете ни съобщение и ще отговорим възможно най-скоро."
    )
    address_line1_bg = models.CharField(
        max_length=200,
        verbose_name="Адрес ред 1 (Български)",
        help_text="Първи ред на адреса на български",
        default="Луксозен офис комплекс"
    )
    address_line2_bg = models.CharField(
        max_length=200,
        verbose_name="Адрес ред 2 (Български)",
        help_text="Втори ред на адреса на български",
        default="София, България"
    )
    
    # Contact details
    email = models.EmailField(
        verbose_name="Email Address",
        help_text="Contact email address",
        default="contact@aurexiaestate.com"
    )
    phone = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Phone Number",
        help_text="Optional: Contact phone number"
    )
    
    # Metadata
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Contact Page Content"
        verbose_name_plural = "Contact Page Content"
    
    def __str__(self):
        return "Contact Page Content"
    
    def save(self, *args, **kwargs):
        """Ensure only one instance exists (singleton pattern)"""
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        """Prevent deletion of the singleton instance"""
        pass
    
    @classmethod
    def load(cls):
        """Get or create the singleton instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
