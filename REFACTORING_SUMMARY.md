# Aurexia Estate - Backend Refactoring Summary

## Overview
This document summarizes the complete refactoring of the Generix Django/Angular application into **Aurexia Estate**, a luxury real estate connector platform.

**Date:** February 2025  
**Approach:** Option B - Clean up existing Generix models first, then add Aurexia functionality

---

## 🎯 Business Context

**Aurexia Estate** is NOT a real estate agency. It's a **connector platform** that bridges:
- 🏡 Luxury property investors/sellers who list properties
- 💼 Buyers/investors looking for premium real estate

### Revenue Model
- **Monthly listing fee** from property investors
- **Commission percentage** on closed deals

### Target Market
- **50-100 luxury properties** across:
  - 🇪🇸 Spain
  - 🇦🇪 Dubai
  - 🇨🇭 Switzerland
  - 🇩🇪 Germany
  - 🇸🇮 Slovenia

### Design Philosophy
- **Ultra-luxury dark theme** (Sotheby's-level branding)
- Primary color: `#0a0a0a` (deep black)
- Surface color: `#1a1a1a` (charcoal)
- Accent gold: `#c9a84c` with hover `#b39440`
- Typography: Cormorant Garamond (headings), Montserrat (body)

---

## 📦 Technology Stack

### Backend
- **Django 5.2.5** - Web framework
- **Django REST Framework 3.16.1** - API toolkit
- **PostgreSQL** (psycopg2-binary 2.9.10) - Database
- **Cloudinary 1.44.1** - Image storage and management
- **django-filter 25.1** - API filtering
- **Gunicorn 23.0.0** - WSGI server
- **WhiteNoise 6.8.2** - Static file serving
- **django-cors-headers 4.7.0** - CORS handling

### Frontend
- **Angular 19/20** - Frontend framework
- **TypeScript 5.9.2** - Type-safe JavaScript
- **SCSS** - Styling

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **Python 3.14.3** - Runtime environment

---

## 🔄 Changes Made

### 1. **api_generix App - Cleanup** ✅

#### Removed Models (10 total)
The following Generix-specific models were removed as they don't fit the real estate platform:

1. `CustomersSection` - Generic customer showcase
2. `WhyGenerixSection` - Company value propositions
3. `CaseStudySlide` - Project case studies
4. `PlatformsSectionHeader` - Platform integration header
5. `AboutPageHero` - About page hero section
6. `HomePageCTA` - Generic homepage call-to-action
7. `PlatformCard` - Integration platform cards
8. `PlatformFeature` - Platform feature bullets
9. `AboutUsImageContent` - About page image grid
10. `AboutPageAchievements` - About page stats

#### Kept Models (9 total)
These models are reusable for any content-driven website:

1. **`CacheSettings`** - Singleton for API cache control (cache_enabled, cache_timeout)
2. **`HeroSlide`** - Homepage hero carousel with EN/BG translations
3. **`Achievement`** - Statistics carousel (icon, value, label, order)
4. **`Partner`** - Partner/client logo carousel
5. **`AboutUsTestimonial`** - Singleton for About page testimonial section
6. **`CallToAction`** - Reusable CTA blocks with style variants (gradient/dark/light)
7. **`ThemeSettings`** - Singleton for theme colors and typography (UPDATED for Aurexia)
8. **`TestimonialCard`** - Client testimonial cards with star ratings
9. **`ContactPageContent`** - Singleton for Contact page hero and content sections

#### Updated Model
**`ThemeSettings`** now includes Aurexia-specific dark luxury theme:
```python
color_primary = '#0a0a0a'          # Deep black
color_primary_dark = '#000000'     # Pure black
color_surface = '#1a1a1a'          # Charcoal
color_text_primary = '#ffffff'     # White text
color_text_secondary = '#a0a0a0'   # Gray text
color_accent_gold = '#c9a84c'      # Gold accent
color_accent_gold_hover = '#b39440' # Darker gold on hover
font_heading = 'Cormorant Garamond, serif'
font_body = 'Montserrat, sans-serif'
```

#### Architecture Updates
- **Converted to ViewSet-based architecture** (from function-based views)
- **Router-based URLs** using `DefaultRouter()`
- **Singleton pattern** for CacheSettings, ThemeSettings, AboutUsTestimonial, ContactPageContent
- **Cache decorator support** via `@cached_api_view` from cache_utils.py

#### Backups Created
All original files backed up with `.backup` extension:
- `models.py.backup`
- `admin.py.backup`
- `serializers.py.backup`
- `views.py.backup`
- `urls.py.backup`

---

### 2. **api_aurexia App - New** ✅

Complete real estate management Django app created from scratch.

#### Models (7 total)

##### **1. Destination**
Countries/cities where properties are located.
```python
Fields:
- name_en / name_bg (CharField max_length=100)
- description_en / description_bg (TextField)
- slug (SlugField, auto-generated from name_en)
- hero_image (CloudinaryField, folder='aurexia/destinations/heroes')
- thumbnail_image (CloudinaryField, folder='aurexia/destinations/thumbnails')
- meta_title_en/bg, meta_description_en/bg (SEO)
- is_featured (BooleanField, default=False)
- is_active (BooleanField, default=True)
- order (PositiveIntegerField, default=0)
- created_at, updated_at (auto)

Properties:
- @property active_properties_count → queryset count

Meta:
- ordering = ['order', 'name_en']
- indexes = [destination, is_featured, is_active]
```

##### **2. PropertyFeature**
Reusable property amenities (Pool, Gym, Sea View, etc.)
```python
Fields:
- name_en / name_bg (CharField max_length=100)
- icon (CharField max_length=100) # Font Awesome class or URL
- order (PositiveIntegerField, default=0)
- is_active (BooleanField, default=True)

Meta:
- ordering = ['order', 'name_en']
```

##### **3. Property**
Core luxury property model.
```python
Fields:
- title_en / title_bg (CharField max_length=200)
- description_en / description_bg (TextField)
- short_description_en / short_description_bg (TextField max_length=300)
- destination (ForeignKey → Destination)
- features (ManyToMany → PropertyFeature through PropertyFeatureLink)
- property_type (CharField choices=['villa', 'penthouse', 'mansion', 'apartment', 'estate', 'chalet'])
- status (CharField choices=['available', 'reserved', 'sold'])
- price (DecimalField max_digits=12, decimal_places=2)
- price_currency (CharField choices=['EUR', 'USD', 'GBP', 'CHF'], default='EUR')
- bedrooms, bathrooms (PositiveIntegerField)
- area_sqm, plot_size_sqm (DecimalField, nullable)
- address_en/bg, city_en/bg, postal_code (CharField, nullable)
- latitude, longitude (DecimalField, nullable, for map integration)
- featured_image (CloudinaryField, folder='aurexia/properties/featured')
- video_url, virtual_tour_url (URLField, nullable)
- slug (SlugField, unique, auto-generated with duplicate handling)
- meta_title_en/bg, meta_description_en/bg (SEO)
- is_featured (BooleanField)
- is_active (BooleanField)
- views_count (PositiveIntegerField, default=0)
- created_at, updated_at (auto)

Properties:
- @property formatted_price → "€1,500,000" or "$2,000,000"

Methods:
- save() → auto-generate unique slug from title_en

Meta:
- ordering = ['-created_at']
- indexes = [destination, status, is_active, is_featured]
```

##### **4. PropertyFeatureLink**
Explicit M2M through table for Property ↔ PropertyFeature relationship.

##### **5. PropertyImage**
Property gallery images.
```python
Fields:
- property (ForeignKey → Property)
- image (CloudinaryField, folder='aurexia/properties/gallery')
- caption_en / caption_bg (CharField max_length=200, nullable)
- order (PositiveIntegerField, default=0)
- uploaded_at (auto)

Meta:
- ordering = ['order', 'uploaded_at']
```

##### **6. PropertyInquiry**
Contact form submissions from buyers.
```python
Fields:
- property (ForeignKey → Property, nullable for general inquiries)
- full_name, email, phone (CharField)
- message (TextField)
- budget_range (CharField max_length=100, nullable)
- preferred_contact_method (CharField choices=['email', 'phone', 'whatsapp'], default='email')
- is_contacted (BooleanField, default=False)
- contacted_at (DateTimeField, nullable)
- notes (TextField, blank=True) # Staff notes
- created_at (auto)

Meta:
- ordering = ['-created_at', 'is_contacted']
- indexes = [property, is_contacted]
```

##### **7. InvestorListing**
Investor/seller subscription management.
```python
Fields:
- company_name (CharField max_length=200)
- contact_person, email, phone (CharField)
- subscription_status (CharField choices=['active', 'inactive', 'pending'], default='pending')
- subscription_start, subscription_end (DateField, nullable)
- monthly_fee (DecimalField max_digits=10, decimal_places=2)
- properties_count (PositiveIntegerField, default=0)
- is_active (BooleanField, default=True)
- notes (TextField, blank=True)
- created_at, updated_at (auto)

Meta:
- ordering = ['-created_at']
```

#### Serializers (9 total)

1. **DestinationListSerializer** - For destination cards (minimal fields)
2. **DestinationDetailSerializer** - Full destination page data
3. **PropertyFeatureSerializer** - Simple feature serialization
4. **PropertyImageSerializer** - Gallery image serialization
5. **PropertyListSerializer** - Property cards with nested destination info
   - Read-only fields: `destination_name_en`, `destination_name_bg`, `destination_slug`, `formatted_price`
6. **PropertyDetailSerializer** - Full property details with nested destination, features, images
7. **PropertyInquiryCreateSerializer** - Public form submission (limited fields)
8. **PropertyInquirySerializer** - Admin view (all fields including notes)
9. **InvestorListingSerializer** - Investor management serialization

#### ViewSets (5 total)

1. **DestinationViewSet** (ReadOnlyModelViewSet)
   - `list()`, `retrieve()`
   - `@action featured()` - Returns `is_featured=True` destinations

2. **PropertyFeatureViewSet** (ReadOnlyModelViewSet)
   - `list()`, `retrieve()`

3. **PropertyViewSet** (ReadOnlyModelViewSet + Create for admin)
   - Optimized queries: `.select_related('destination').prefetch_related('features', 'images')`
   - **Filters:** destination__slug, property_type, status
   - **Search:** title, description, city
   - **Ordering:** price, created_at, area_sqm, bedrooms
   - `retrieve()` - Increments `views_count`
   - `@action featured()` - First 6 featured properties
   - `@action by_destination(destination_slug)` - Properties by destination
   - `@action search()` - Advanced search with Q objects:
     - Text search: title/description/city/address
     - Filters: min_price, max_price, min_bedrooms, min_bathrooms, min_area, property_type

4. **PropertyInquiryViewSet** (ModelViewSet)
   - `create()` - AllowAny permission (public contact form)
   - `list()`, `retrieve()`, `update()`, `destroy()` - IsAdminUser
   - Returns success message on POST

5. **InvestorListingViewSet** (ModelViewSet)
   - IsAdminUser only
   - **Filters:** subscription_status, is_active
   - **Search:** company_name, contact_person, email
   - `@action active()` - Active investors

#### Admin Configuration (6 ModelAdmin classes)

1. **DestinationAdmin**
   - Prepopulated slug from name_en
   - List display: name_en, is_featured, is_active, order
   - List filters: is_featured, is_active
   - Search: name_en, name_bg

2. **PropertyFeatureAdmin**
   - List display: name_en, icon, order, is_active
   - Ordering by order

3. **PropertyAdmin**
   - **Inlines:** PropertyImageInline, PropertyFeatureLinkInline
   - Prepopulated slug from title_en
   - Autocomplete: destination
   - List display: title_en, destination, property_type, status, price, formatted_price, is_featured
   - List filters: destination, property_type, status, is_featured, is_active
   - Search: title_en, title_bg, city_en
   - Readonly: views_count

4. **PropertyImageAdmin**
   - List display: property, order, uploaded_at
   - List filter: property
   - Ordering: ['property', 'order']

5. **PropertyInquiryAdmin**
   - **Bulk action:** `mark_as_contacted` (sets is_contacted=True, contacted_at=now)
   - Autocomplete: property
   - List display: full_name, email, property, preferred_contact_method, is_contacted, created_at
   - List filters: is_contacted, preferred_contact_method, created_at
   - Date hierarchy: created_at
   - Search: full_name, email, phone, message
   - Readonly: created_at, contacted_at

6. **InvestorListingAdmin**
   - **Bulk actions:** `activate_subscription`, `deactivate_subscription`
   - List display: company_name, contact_person, subscription_status, monthly_fee, properties_count, is_active
   - List filters: subscription_status, is_active
   - Search: company_name, contact_person, email
   - Readonly: properties_count, created_at, updated_at

#### URL Configuration
Router-based URLs with 5 viewset registrations:
```python
router.register(r'destinations', DestinationViewSet, basename='destination')
router.register(r'features', PropertyFeatureViewSet, basename='propertyfeature')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'inquiries', PropertyInquiryViewSet, basename='propertyinquiry')
router.register(r'investors', InvestorListingViewSet, basename='investorlisting')
```

---

### 3. **Project Integration** ✅

#### Updated `settings.py`
```python
INSTALLED_APPS = [
    # ... existing apps ...
    'generix.api_generix',
    'generix.api_aurexia',  # ← NEW
    # ... existing apps ...
    'django_filters',  # ← NEW
]
```

#### Updated `urls.py`
```python
# Main API root
def api_root(request):
    return JsonResponse({
        'message': 'Welcome to Aurexia Estate API',  # ← UPDATED
        'version': '2.0',  # ← UPDATED from 1.0
        'endpoints': {
            'auth': '/api/auth/',
            'generix': '/api/generix/',
            'aurexia': '/api/aurexia/',  # ← NEW
        }
    })

# API patterns
api_patterns = [
    path('auth/', include('generix.api_auth.urls')),
    path('generix/', include('generix.api_generix.urls')),
    path('aurexia/', include('generix.api_aurexia.urls')),  # ← NEW
]
```

#### Updated `requirements.txt`
Added:
```txt
django-filter==25.1
```

#### Created `cache_utils.py` Enhancement
Added missing `@cached_api_view` decorator to existing `api_generix/cache_utils.py`:
```python
def cached_api_view(timeout=None):
    """
    Decorator for caching ViewSet responses based on CacheSettings.
    Compatible with DRF ViewSets.
    """
    # Implementation that respects CacheSettings.cache_enabled
    # and uses ViewSet-specific cache keys
```

---

## 📋 API Endpoints

### **Authentication** (Existing)
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
GET    /api/auth/profile/
PUT    /api/auth/profile/
```

### **Generix Content** (Cleaned)
```
GET    /api/generix/cache-settings/
GET    /api/generix/hero-slides/
GET    /api/generix/achievements/
GET    /api/generix/partners/
GET    /api/generix/about-us-testimonial/
GET    /api/generix/call-to-actions/
GET    /api/generix/theme-settings/
GET    /api/generix/testimonial-cards/
GET    /api/generix/contact-page-content/
```

### **Aurexia Real Estate** (NEW)
```
# Destinations
GET    /api/aurexia/destinations/
GET    /api/aurexia/destinations/{id}/
GET    /api/aurexia/destinations/featured/

# Property Features (amenities)
GET    /api/aurexia/features/
GET    /api/aurexia/features/{id}/

# Properties
GET    /api/aurexia/properties/
GET    /api/aurexia/properties/{id}/
GET    /api/aurexia/properties/featured/
GET    /api/aurexia/properties/by_destination/?destination_slug=spain
GET    /api/aurexia/properties/search/
       ?text=luxury&min_price=500000&max_price=2000000
       &min_bedrooms=3&property_type=villa

# Filters (on /properties/)
?destination__slug=spain
?property_type=villa
?status=available

# Search (on /properties/)
?search=barcelona

# Ordering (on /properties/)
?ordering=-price          # Highest price first
?ordering=created_at      # Oldest first
?ordering=-area_sqm       # Largest first

# Property Inquiries
POST   /api/aurexia/inquiries/          # AllowAny (public contact form)
GET    /api/aurexia/inquiries/          # IsAdminUser
GET    /api/aurexia/inquiries/{id}/     # IsAdminUser
PUT    /api/aurexia/inquiries/{id}/     # IsAdminUser
DELETE /api/aurexia/inquiries/{id}/     # IsAdminUser

# Investor Listings (admin only)
GET    /api/aurexia/investors/          # IsAdminUser
POST   /api/aurexia/investors/          # IsAdminUser
GET    /api/aurexia/investors/{id}/     # IsAdminUser
PUT    /api/aurexia/investors/{id}/     # IsAdminUser
DELETE /api/aurexia/investors/{id}/     # IsAdminUser
GET    /api/aurexia/investors/active/   # IsAdminUser
```

---

## 🚀 Next Steps

### **Immediate Actions** (Backend)

1. **Install Dependencies**
   ```bash
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Create Migrations**
   ```bash
   python manage.py makemigrations api_aurexia
   python manage.py makemigrations api_generix  # In case of ThemeSettings changes
   ```

3. **Apply Migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create Superuser** (if needed)
   ```bash
   python manage.py createsuperuser
   ```

5. **Test Development Server**
   ```bash
   python manage.py runserver
   ```
   
   Visit:
   - http://localhost:8000/api/ - API root
   - http://localhost:8000/admin/ - Django admin
   - http://localhost:8000/api/aurexia/destinations/ - Test endpoint
   - http://localhost:8000/api/aurexia/properties/ - Test endpoint

6. **Verify API Endpoints**
   Test with curl or Postman:
   ```bash
   # Get all destinations
   curl http://localhost:8000/api/aurexia/destinations/
   
   # Get featured properties
   curl http://localhost:8000/api/aurexia/properties/featured/
   
   # Search properties
   curl "http://localhost:8000/api/aurexia/properties/search/?text=villa&min_price=500000"
   
   # Submit inquiry (public)
   curl -X POST http://localhost:8000/api/aurexia/inquiries/ \
     -H "Content-Type: application/json" \
     -d '{
       "full_name": "John Doe",
       "email": "john@example.com",
       "phone": "+34612345678",
       "message": "Interested in this property"
     }'
   ```

### **Frontend Migration** (Angular)

1. **Create Aurexia Services**
   - `destination.service.ts` - Fetch destinations, featured destinations
   - `property.service.ts` - Fetch properties, search, filters, single property
   - `property-inquiry.service.ts` - Submit contact forms
   - `theme.service.ts` - Fetch ThemeSettings for dynamic theming

2. **Create Aurexia Models/Interfaces**
   ```typescript
   // src/app/core/models/
   export interface Destination { ... }
   export interface Property { ... }
   export interface PropertyFeature { ... }
   export interface PropertyImage { ... }
   export interface PropertyInquiry { ... }
   ```

3. **Create Aurexia Components**
   - `destination-list` - Grid of destination cards
   - `destination-detail` - Single destination page with properties
   - `property-list` - Property cards with filters/search
   - `property-detail` - Full property page with gallery, map, inquiry form
   - `property-inquiry-form` - Contact form component
   - `property-filters` - Sidebar/top filters for search

4. **Update Routing**
   ```typescript
   // src/app/app-routing-module.ts
   {
     path: 'destinations',
     loadChildren: () => import('./features/destinations/destinations.module')
   },
   {
     path: 'destinations/:slug',
     loadChildren: () => import('./features/destination-detail/destination-detail.module')
   },
   {
     path: 'properties',
     loadChildren: () => import('./features/properties/properties.module')
   },
   {
     path: 'properties/:slug',
     loadChildren: () => import('./features/property-detail/property-detail.module')
   }
   ```

5. **Update Theme** (SCSS)
   Integrate Aurexia dark luxury theme colors from ThemeSettings API:
   ```scss
   $color-primary: #0a0a0a;
   $color-surface: #1a1a1a;
   $color-accent-gold: #c9a84c;
   $color-accent-gold-hover: #b39440;
   $font-heading: 'Cormorant Garamond', serif;
   $font-body: 'Montserrat', sans-serif;
   ```

6. **Add Map Integration** (Optional)
   - Leaflet or Google Maps for property locations
   - Use `latitude`/`longitude` from Property model

7. **Add Virtual Tour Integration** (Optional)
   - Embed `virtual_tour_url` iframes in property detail pages

---

## ✅ Testing Checklist

### Backend Tests
- [ ] All migrations apply successfully
- [ ] Admin interface loads for all models
- [ ] Can create Destination via admin
- [ ] Can create Property with featured image via admin
- [ ] Can upload PropertyImage gallery images
- [ ] PropertyInquiry form submission works (AllowAny endpoint)
- [ ] Property search endpoint returns correct results
- [ ] Filtering by destination works
- [ ] Featured properties endpoint returns correct data
- [ ] Cache decorator respects CacheSettings
- [ ] Cloudinary images upload correctly with folder structure

### Frontend Tests (After Migration)
- [ ] Destination list page renders
- [ ] Property list page renders with filters
- [ ] Property search works
- [ ] Property detail page shows all data
- [ ] Image gallery works
- [ ] Contact form submits successfully
- [ ] Theme colors match ThemeSettings API
- [ ] Responsive design on mobile/tablet
- [ ] SEO meta tags populate correctly

---

## 📊 Database Schema Overview

```
┌─────────────────────┐
│   Destination       │
│  (Spain, Dubai...)  │
└──────────┬──────────┘
           │
           │ FK (destination)
           ▼
┌─────────────────────┐      ┌──────────────────┐
│     Property        │◄─────┤  PropertyImage   │
│  (Villa, Mansion)   │      │  (Gallery pics)  │
└──────────┬──────────┘      └──────────────────┘
           │
           │ M2M (through PropertyFeatureLink)
           ▼
┌─────────────────────┐
│  PropertyFeature    │
│  (Pool, Gym,...)    │
└─────────────────────┘

┌─────────────────────┐      ┌──────────────────┐
│  PropertyInquiry    │──FK──►     Property      │
│  (Contact forms)    │      │                  │
└─────────────────────┘      └──────────────────┘

┌─────────────────────┐
│  InvestorListing    │
│  (Subscriptions)    │
└─────────────────────┘

SINGLETONS (only 1 instance):
┌─────────────────────┐
│   CacheSettings     │
│   ThemeSettings     │
│ AboutUsTestimonial  │
│ ContactPageContent  │
└─────────────────────┘
```

---

## 🎨 Cloudinary Folder Structure

All images organized in Cloudinary folders:

```
aurexia/
├── destinations/
│   ├── heroes/          # Destination hero images
│   └── thumbnails/      # Destination card thumbnails
└── properties/
    ├── featured/        # Property featured/cover images
    └── gallery/         # Property gallery images
```

**Configuration:**
- All images use `CloudinaryField` from `cloudinary.models`
- Folder paths defined in model field: `CloudinaryField(folder='aurexia/properties/featured')`
- Cloudinary credentials configured in `settings.py` (via environment variables)

---

## 🔐 Authentication & Permissions

### Existing Auth System (Preserved)
- `api_auth` app handles user registration, login, profile management
- Token authentication via Django REST Framework
- Email verification system with Mailjet integration

### New Aurexia Permissions
- **Public (AllowAny):**
  - All GET endpoints for destinations, properties, features
  - POST `/api/aurexia/inquiries/` (contact form submission)

- **Admin Only (IsAdminUser):**
  - All InvestorListing endpoints
  - PropertyInquiry list/update/delete
  - Property create/update/delete (via Django admin or API)

---

## 📝 Notes & Best Practices

### Development
- **Always activate virtual environment:** `source backend/venv/bin/activate`
- **Check migrations before committing:** `python manage.py makemigrations --check --dry-run`
- **Use Django admin for initial data population** (destinations, features, properties)
- **Test API endpoints with Postman/curl** before frontend integration

### Production Deployment
- **Cloudinary:** Ensure `CLOUDINARY_URL` environment variable is set
- **Database:** Use PostgreSQL with `DATABASE_URL` environment variable
- **Static files:** Run `python manage.py collectstatic` before deployment
- **Migrations:** Always run `python manage.py migrate` on new deployments
- **CORS:** Update `CORS_ALLOWED_ORIGINS` in settings.py for production domain

### Security
- **Never commit:** `.env` files, `settings.py` with hardcoded secrets
- **Use environment variables** for: `SECRET_KEY`, `DATABASE_URL`, `CLOUDINARY_URL`, `MAILJET_API_KEY`
- **Admin endpoints:** Should be behind authentication in production
- **Rate limiting:** Consider adding DRF throttling for public inquiry endpoint

---

## 🐛 Known Issues & TODOs

### Critical
- ❌ **Need to run migrations** - No database tables created yet for api_aurexia
- ❌ **Frontend not updated** - Angular app still points to old Generix models

### Nice-to-Have
- ⚠️ Add rate limiting to PropertyInquiry create endpoint
- ⚠️ Add export functionality in admin (export properties to CSV/Excel)
- ⚠️ Add bulk import for properties (CSV upload in admin)
- ⚠️ Add analytics tracking (views_count is implemented but could add more metrics)
- ⚠️ Add email notifications to investors when new inquiry received
- ⚠️ Add property comparison feature (compare multiple properties)
- ⚠️ Add saved/favorited properties (requires user authentication)

---

## 📧 Contact & Support

**Project:** Aurexia Estate  
**Developer:** Assistant (GitHub Copilot)  
**Date:** February 2025  
**Django Version:** 5.2.5  
**DRF Version:** 3.16.1

For questions or issues, refer to:
- Django docs: https://docs.djangoproject.com/
- DRF docs: https://www.django-rest-framework.org/
- Cloudinary docs: https://cloudinary.com/documentation/django_integration

---

**🎉 Refactoring Complete! Ready for migrations and testing.**
