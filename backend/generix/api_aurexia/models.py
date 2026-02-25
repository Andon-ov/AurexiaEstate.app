from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from cloudinary.models import CloudinaryField


class Destination(models.Model):
    """
    Luxury real estate destinations
    Spain, Dubai, Switzerland, Germany, Slovenia
    """
    # English
    name_en = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Name (English)",
        help_text="Destination name in English (e.g., 'Spain', 'Dubai')"
    )
    description_en = models.TextField(
        verbose_name="Description (English)",
        help_text="Destination description in English"
    )
    short_description_en = models.CharField(
        max_length=300,
        verbose_name="Short Description (English)",
        help_text="Brief description for cards (max 300 characters)"
    )
    
    # Bulgarian
    name_bg = models.CharField(
        max_length=100,
        verbose_name="Име (Български)",
        help_text="Име на дестинацията на български"
    )
    description_bg = models.TextField(
        verbose_name="Описание (Български)",
        help_text="Описание на дестинацията на български"
    )
    short_description_bg = models.CharField(
        max_length=300,
        verbose_name="Кратко описание (Български)",
        help_text="Кратко описание за карти (максимум 300 символа)"
    )
    
    # Common fields
    slug = models.SlugField(
        max_length=100,
        unique=True,
        verbose_name="Slug",
        help_text="URL-friendly identifier (e.g., 'spain', 'dubai')"
    )
    hero_image = CloudinaryField(
        "Hero Image",
        folder='aurexia/destinations/heroes',
        help_text="Large hero image for destination page"
    )
    thumbnail_image = CloudinaryField(
        "Thumbnail Image",
        folder='aurexia/destinations/thumbnails',
        help_text="Thumbnail for destination cards"
    )
    
    # SEO
    meta_title_en = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Meta Title (EN)",
        help_text="SEO meta title (optional)"
    )
    meta_description_en = models.CharField(
        max_length=300,
        blank=True,
        verbose_name="Meta Description (EN)",
        help_text="SEO meta description (optional)"
    )
    
    # Metadata
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Featured",
        help_text="Show on homepage featured destinations"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
        help_text="Make destination visible on website"
    )
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order (lower numbers appear first)"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name_en']
        verbose_name = "Destination"
        verbose_name_plural = "Destinations"
    
    def __str__(self):
        return f"{self.name_en} ({self.slug})"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_en)
        super().save(*args, **kwargs)
    
    @property
    def active_properties_count(self):
        """Count of active properties in this destination"""
        return self.properties.filter(is_active=True, status='available').count()


class PropertyFeature(models.Model):
    """
    Property features/amenities
    Pool, Gym, Security, Sea View, etc.
    """
    # English
    name_en = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Feature Name (English)",
        help_text="Feature name in English (e.g., 'Swimming Pool', 'Sea View')"
    )
    
    # Bulgarian
    name_bg = models.CharField(
        max_length=100,
        verbose_name="Име (Български)",
        help_text="Име на удобството на български"
    )
    
    # Icon
    icon = models.CharField(
        max_length=100,
        verbose_name="Icon",
        help_text="Font Awesome class or URL (e.g., 'fa-swimming-pool')"
    )
    
    # Metadata
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name_en']
        verbose_name = "Property Feature"
        verbose_name_plural = "Property Features"
    
    def __str__(self):
        return f"{self.name_en} ({self.icon})"


class Property(models.Model):
    """
    Luxury properties for sale
    """
    
    PROPERTY_TYPES = [
        ('villa', 'Villa'),
        ('penthouse', 'Penthouse'),
        ('mansion', 'Mansion'),
        ('apartment', 'Luxury Apartment'),
        ('estate', 'Estate'),
        ('chalet', 'Chalet'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('sold', 'Sold'),
    ]
    
    CURRENCY_CHOICES = [
        ('EUR', '€ Euro'),
        ('USD', '$ US Dollar'),
        ('GBP', '£ Pound Sterling'),
        ('CHF', 'CHF Swiss Franc'),
    ]
    
    # English
    title_en = models.CharField(
        max_length=300,
        verbose_name="Title (English)",
        help_text="Property title in English"
    )
    description_en = models.TextField(
        verbose_name="Description (English)",
        help_text="Full property description in English"
    )
    short_description_en = models.CharField(
        max_length=300,
        verbose_name="Short Description (English)",
        help_text="Brief description for cards (max 300 characters)"
    )
    
    # Bulgarian
    title_bg = models.CharField(
        max_length=300,
        verbose_name="Заглавие (Български)",
        help_text="Заглавие на имота на български"
    )
    description_bg = models.TextField(
        verbose_name="Описание (Български)",
        help_text="Пълно описание на имота на български"
    )
    short_description_bg = models.CharField(
        max_length=300,
        verbose_name="Кратко описание (Български)",
        help_text="Кратко описание за карти (максимум 300 символа)"
    )
    
    # Relations
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name='properties',
        verbose_name="Destination",
        help_text="Property destination"
    )
    features = models.ManyToManyField(
        PropertyFeature,
        through='PropertyFeatureLink',
        related_name='properties',
        verbose_name="Features",
        blank=True
    )
    
    # Property Details
    property_type = models.CharField(
        max_length=50,
        choices=PROPERTY_TYPES,
        default='villa',
        verbose_name="Property Type"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available',
        verbose_name="Status"
    )
    
    # Pricing
    price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Price",
        help_text="Property price"
    )
    price_currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default='EUR',
        verbose_name="Currency"
    )
    
    # Specifications
    bedrooms = models.IntegerField(
        validators=[MinValueValidator(0)],
        verbose_name="Bedrooms",
        help_text="Number of bedrooms"
    )
    bathrooms = models.IntegerField(
        validators=[MinValueValidator(0)],
        verbose_name="Bathrooms",
        help_text="Number of bathrooms"
    )
    area_sqm = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Area (m²)",
        help_text="Total area in square meters"
    )
    plot_size_sqm = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        blank=True,
        null=True,
        verbose_name="Plot Size (m²)",
        help_text="Plot/land size in square meters (optional)"
    )
    
    # Location
    address = models.CharField(
        max_length=300,
        verbose_name="Address",
        help_text="Property address"
    )
    city = models.CharField(
        max_length=100,
        verbose_name="City"
    )
    postal_code = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Postal Code"
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        verbose_name="Latitude",
        help_text="GPS latitude for map"
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        verbose_name="Longitude",
        help_text="GPS longitude for map"
    )
    
    # Media
    featured_image = CloudinaryField(
        "Featured Image",
        folder='aurexia/properties/featured',
        help_text="Main property image"
    )
    video_url = models.URLField(
        blank=True,
        verbose_name="Video URL",
        help_text="Optional: YouTube or Vimeo URL"
    )
    virtual_tour_url = models.URLField(
        blank=True,
        verbose_name="Virtual Tour URL",
        help_text="Optional: 360° virtual tour URL"
    )
    
    # SEO
    slug = models.SlugField(
        max_length=300,
        unique=True,
        verbose_name="Slug",
        help_text="URL-friendly identifier"
    )
    meta_title_en = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Meta Title (EN)"
    )
    meta_description_en = models.CharField(
        max_length=300,
        blank=True,
        verbose_name="Meta Description (EN)"
    )
    
    # Metadata
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Featured",
        help_text="Show on homepage featured properties"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active",
        help_text="Make property visible on website"
    )
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order (lower numbers appear first)"
    )
    views_count = models.IntegerField(
        default=0,
        verbose_name="Views Count",
        help_text="Number of times property page was viewed"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Published At",
        help_text="When property was published"
    )
    
    class Meta:
        ordering = ['-is_featured', 'order', '-created_at']
        verbose_name = "Property"
        verbose_name_plural = "Properties"
        indexes = [
            models.Index(fields=['destination', 'status', 'is_active']),
            models.Index(fields=['is_featured', 'is_active']),
            models.Index(fields=['slug']),
        ]
    
    def __str__(self):
        return f"{self.title_en} - {self.destination.name_en} ({self.price} {self.price_currency})"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title_en)
            self.slug = base_slug
            # Ensure unique slug
            counter = 1
            while Property.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    @property
    def formatted_price(self):
        """Return formatted price with currency symbol"""
        currency_symbols = {
            'EUR': '€',
            'USD': '$',
            'GBP': '£',
            'CHF': 'CHF'
        }
        symbol = currency_symbols.get(self.price_currency, self.price_currency)
        return f"{symbol}{self.price:,.0f}"


class PropertyFeatureLink(models.Model):
    """
    Many-to-many relationship between Property and PropertyFeature
    """
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='feature_links'
    )
    feature = models.ForeignKey(
        PropertyFeature,
        on_delete=models.CASCADE,
        related_name='property_links'
    )
    
    class Meta:
        unique_together = [['property', 'feature']]
        verbose_name = "Property Feature Link"
        verbose_name_plural = "Property Feature Links"
    
    def __str__(self):
        return f"{self.property.title_en} - {self.feature.name_en}"


class PropertyImage(models.Model):
    """
    Additional images for property gallery
    """
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="Property"
    )
    image = CloudinaryField(
        "Image",
        folder='aurexia/properties/gallery'
    )
    
    # Captions (optional)
    caption_en = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Caption (English)",
        help_text="Optional image caption in English"
    )
    caption_bg = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Надпис (Български)",
        help_text="Опционален надпис на снимката на български"
    )
    
    # Metadata
    order = models.IntegerField(
        default=0,
        verbose_name="Order",
        help_text="Display order in gallery"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['property', 'order', 'id']
        verbose_name = "Property Image"
        verbose_name_plural = "Property Images"
    
    def __str__(self):
        return f"{self.property.title_en} - Image {self.order}"


class PropertyInquiry(models.Model):
    """
    Contact form submissions from potential buyers
    """
    
    CONTACT_METHOD_CHOICES = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    # Property reference
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='inquiries',
        verbose_name="Property"
    )
    
    # Contact information
    full_name = models.CharField(
        max_length=200,
        verbose_name="Full Name"
    )
    email = models.EmailField(
        verbose_name="Email Address"
    )
    phone = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Phone Number"
    )
    
    # Inquiry details
    message = models.TextField(
        verbose_name="Message",
        help_text="Inquiry message from potential buyer"
    )
    budget_range = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Budget Range",
        help_text="Optional: buyer's budget range"
    )
    preferred_contact_method = models.CharField(
        max_length=20,
        choices=CONTACT_METHOD_CHOICES,
        default='email',
        verbose_name="Preferred Contact Method"
    )
    
    # Status tracking
    is_contacted = models.BooleanField(
        default=False,
        verbose_name="Contacted",
        help_text="Mark as contacted after follow-up"
    )
    contacted_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Contacted At"
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Internal Notes",
        help_text="Private notes for staff only"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Property Inquiry"
        verbose_name_plural = "Property Inquiries"
    
    def __str__(self):
        return f"Inquiry from {self.full_name} - {self.property.title_en}"


class InvestorListing(models.Model):
    """
    Investors who pay monthly subscription fee to list properties
    """
    
    SUBSCRIPTION_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    ]
    
    # Company information
    company_name = models.CharField(
        max_length=200,
        verbose_name="Company Name"
    )
    contact_person = models.CharField(
        max_length=200,
        verbose_name="Contact Person Name"
    )
    email = models.EmailField(
        unique=True,
        verbose_name="Email Address"
    )
    phone = models.CharField(
        max_length=50,
        verbose_name="Phone Number"
    )
    address = models.TextField(
        blank=True,
        verbose_name="Company Address"
    )
    
    # Subscription details
    subscription_status = models.CharField(
        max_length=20,
        choices=SUBSCRIPTION_STATUS_CHOICES,
        default='pending',
        verbose_name="Subscription Status"
    )
    subscription_start = models.DateField(
        blank=True,
        null=True,
        verbose_name="Subscription Start Date"
    )
    subscription_end = models.DateField(
        blank=True,
        null=True,
        verbose_name="Subscription End Date"
    )
    monthly_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Monthly Fee (EUR)",
        help_text="Monthly subscription fee in EUR"
    )
    
    # Statistics
    properties_count = models.IntegerField(
        default=0,
        verbose_name="Properties Count",
        help_text="Number of active properties from this investor"
    )
    
    # Notes
    notes = models.TextField(
        blank=True,
        verbose_name="Internal Notes",
        help_text="Private notes for staff only"
    )
    
    # Metadata
    is_active = models.BooleanField(
        default=True,
        verbose_name="Active"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Investor Listing"
        verbose_name_plural = "Investor Listings"
    
    def __str__(self):
        return f"{self.company_name} ({self.subscription_status})"
    
    def update_properties_count(self):
        """Update the properties count for this investor"""
        # Note: This assumes a relationship between property and investor
        # You may need to add an investor field to Property model
        # For now, this is a placeholder
        self.properties_count = 0  # Update logic here
        self.save()
