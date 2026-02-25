# Aurexia Estate

> **Luxury Real Estate Connector Platform**  
> Django REST API + Angular SPA + PostgreSQL + Cloudinary + Mailjet

**Refactored from**: Generix App  
**Version**: 2.0  
**Status**: In Development

---

## 📋 Съдържание

- [Общ преглед](#-общ-преглед)
- [Технологии](#-технологии)
- [Архитектура](#-архитектура)
- [Стартиране на проекта](#-стартиране-на-проекта)
- [Environment Variables](#-environment-variables)
- [База данни](#️-база-данни)
- [Функционалности](#-функционалности)
- [API Документация](#-api-документация)
- [Frontend Структура](#-frontend-структура)
- [Backend Структура](#-backend-структура)
- [Deployment](#-deployment)
- [Тестване](#-тестване)
- [Известни проблеми](#️-известни-проблеми)
- [Бъдещи подобрения](#-бъдещи-подобрения)

---

## 🎯 Общ преглед

**Aurexia Estate** е луксозна платформа за свързване на инвеститори/продавачи на имоти с купувачи. **Не сме агенция** - ние свързваме страните и улесняваем сделките.

### Бизнес Модел
- 💰 **Месечна такса** за листване на имоти от инвеститори
- 🤝 **Комисионна** при приключване на сделка
- 🌍 **Таргет**: 50-100 луксозни имота в Испания, Дубай, Швейцария, Германия, Словения

### Ключови Характеристики
- 🏰 **Ultra-Luxury Branding** - Sotheby's-level дизайн с тъмна тема
- 🚀 **Performance** - Intelligent caching, lazy loading, CloudinaryField optimization
- 🌐 **i18n** - Пълна поддръжка на Български и Английски език
- 📱 **Responsive** - Mobile-first design с 6 breakpoints
- 🎨 **Dark Theme** - #0a0a0a primary, #c9a84c gold accent
- 🔒 **Security** - CORS, CSRF tokens, role-based permissions
- 📧 **Email Notifications** - Mailjet integration за inquiry forms
- 🖼️ **Cloudinary CDN** - Оптимизирани изображения с организирана folder структура
- 🔍 **SEO Optimized** - Meta tags, Open Graph, structured data
- 🔎 **Advanced Search** - Филтри по цена, брой стаи, локация, тип имот

---

## 🛠️ Технологии

### Backend
- **Django 5.2.5** - Python web framework
- **Django REST Framework 3.16.1** - RESTful API
- **django-filter 25.1** - Advanced filtering for properties
- **PostgreSQL 15** - Relational database
- **Gunicorn** - WSGI HTTP Server
- **WhiteNoise** - Static files serving
- **Cloudinary** - Image storage & CDN
- **Mailjet** - Email service provider
- **python-decouple** - Environment variables management
- **dj-database-url** - Database configuration

### Frontend
- **Angular 19** - TypeScript framework
- **RxJS** - Reactive programming
- **ngx-translate** - i18n library
- **Font Awesome** - Icons
- **SCSS** - CSS preprocessor
- **TypeScript 5.7** - Static typing

### DevOps & Infrastructure
- **Docker** - Containerization
- **Nginx** - Web Server & Reverse Proxy
- **GitHub** - Version control
- **npm** - Package manager
- **pip** - Python package manager

---

## 🏗️ Архитектура

### Проектна структура

```
AurexiaEstate.app/
├── backend/                      # Django Backend
│   ├── generix/                  # Django project
│   │   ├── __init__.py
│   │   ├── settings.py          # Settings (CORS, DB, Cloudinary, Mailjet)
│   │   ├── urls.py              # URL routing (API v2.0)
│   │   ├── wsgi.py              # WSGI config
│   │   ├── asgi.py              # ASGI config
│   │   ├── api_auth/            # Authentication app
│   │   │   ├── models.py        # User models
│   │   │   ├── views.py         # Auth views
│   │   │   ├── urls.py          # Auth endpoints
│   │   │   └── migrations/
│   │   ├── api_generix/         # Content API (cleaned - 9 models)
│   │   │   ├── models.py        # HeroSlide, Achievement, ThemeSettings, etc.
│   │   │   ├── views.py         # ViewSet-based API views
│   │   │   ├── serializers.py   # DRF serializers
│   │   │   ├── urls.py          # Router-based endpoints
│   │   │   ├── admin.py         # Django Admin config
│   │   │   ├── cache_utils.py   # Caching decorators
│   │   │   └── migrations/
│   │   ├── api_aurexia/         # ⭐ NEW: Real Estate API (7 models)
│   │   │   ├── models.py        # Destination, Property, PropertyFeature, etc.
│   │   │   ├── views.py         # ViewSets with filters/search
│   │   │   ├── serializers.py   # List/Detail serializers
│   │   │   ├── urls.py          # /api/aurexia/ endpoints
│   │   │   ├── admin.py         # Property management admin
│   │   │   └── migrations/
│   │   └── templates/           # Django templates
│   ├── manage.py                # Django CLI
│   ├── requirements.txt         # Python dependencies (+ django-filter)
│   ├── .env                     # Environment variables (not in git)
│   └── .env.example             # Environment template
│
├── frontend/                    # Angular Frontend (TO BE UPDATED)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/            # Core services
│   │   │   │   ├── services/
│   │   │   │   │   ├── cache.service.ts
│   │   │   │   │   ├── translation.service.ts
│   │   │   │   │   ├── theme.service.ts  # ⭐ NEW: Dark theme
│   │   │   │   │   └── seo.service.ts
│   │   │   │   └── interceptors/
│   │   │   ├── services/        # API services (TO BE CREATED)
│   │   │   │   ├── destination.service.ts    # ⭐ NEW
│   │   │   │   ├── property.service.ts       # ⭐ NEW
│   │   │   │   ├── inquiry.service.ts        # ⭐ NEW
│   │   │   │   └── hero.service.ts
│   │   │   ├── features/        # Feature modules
│   │   │   │   └── user/
│   │   │   │       ├── login/
│   │   │   │       └── register/
│   │   │   ├── pages/           # Page components (TO BE UPDATED)
│   │   │   │   ├── home/
│   │   │   │   ├── destinations/            # ⭐ NEW
│   │   │   │   ├── destination-detail/      # ⭐ NEW
│   │   │   │   ├── properties/              # ⭐ NEW
│   │   │   │   ├── property-detail/         # ⭐ NEW
│   │   │   │   ├── about/
│   │   │   │   ├── contact/
│   │   │   │   ├── search/
│   │   │   │   ├── privacy-policy/
│   │   │   │   └── cookie-policy/
│   │   │   ├── layouts/         # Layout components
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   │   └── home-layout/
│   │   │   ├── shared/          # Shared components
│   │   │   │   ├── property-card/           # ⭐ NEW
│   │   │   │   ├── property-filters/        # ⭐ NEW
│   │   │   │   ├── property-inquiry-form/   # ⭐ NEW
│   │   │   │   ├── testimonials/
│   │   │   │   └── call-to-action/
│   │   │   ├── app-module.ts
│   │   │   ├── app-routing-module.ts
│   │   │   └── app.ts
│   │   ├── assets/
│   │   │   ├── i18n/            # Translation files
│   │   │   │   ├── bg.json      # Български
│   │   │   │   └── en.json      # English
│   │   │   └── images/
│   │   ├── styles.scss          # Global styles
│   │   ├── index.html
│   │   └── main.ts
│   ├── public/
│   │   ├── sitemap.xml          # SEO sitemap
│   │   └── favicon.ico
│   ├── angular.json             # Angular config
│   ├── package.json             # npm dependencies
│   ├── tsconfig.json            # TypeScript config
│   └── tsconfig.app.json
│
├── render.yaml                  # Render.com Blueprint
├── DEPLOYMENT.md                # Deployment guide
├── .gitignore
└── README.md
```

---

## 🚀 Стартиране на проекта

### Предварителни изисквания

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### 1. Клониране на репото

```bash
git clone https://github.com/Andon-ov/generix.app.git
cd generix.app
```

### 2. Backend Setup (Django)

#### 2.1. Създай виртуална среда

```bash
cd backend
python -m venv venv

# Активирай виртуалната среда
# Linux/Mac:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

#### 2.2. Инсталирай зависимости

```bash
pip install -r requirements.txt
```

#### 2.3. Конфигурирай `.env` файл

Копирай `.env.example` и попълни стойностите:

```bash
cp .env.example .env
```

Редактирай `.env` (виж [Environment Variables](#-environment-variables) за детайли):

```dotenv
# Django Settings
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Django uses these variables)
DB_NAME=aurexia_db
DB_USER=postgres
DB_PASSWORD=1123QwER
DB_HOST=localhost
DB_PORT=5432

# Cloudinary (для изображений недвижимости)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Mailjet (для форм связи)
MAILJET_API_KEY=your-mailjet-api-key
MAILJET_API_SECRET=your-mailjet-api-secret
DEFAULT_FROM_EMAIL=noreply@aurexia.estate
CONTACT_FORM_RECIPIENT=inquiries@aurexia.estate

# Frontend URL
BASE_URL=http://localhost:4200

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

#### 2.4. Настройка на PostgreSQL

Създай база данни (Docker):

```bash
docker run -d \
  --name postgres-aurexia \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1123QwER \
  -e POSTGRES_DB=aurexia_db \
  -p 5432:5432 \
  -v aurexia-data:/var/lib/postgresql/data \
  postgres:15
```

Или локално с `psql`:

```sql
CREATE DATABASE generix_db;
CREATE USER postgres WITH PASSWORD '1123QwER';
GRANT ALL PRIVILEGES ON DATABASE generix_db TO postgres;
```

#### 2.5. Приложи миграции

```bash
python manage.py makemigrations
python manage.py migrate
```

#### 2.6. Създай superuser

```bash
python manage.py createsuperuser
```

#### 2.7. Стартирай сървъра

```bash
python manage.py runserver
```

Backend ще работи на: **http://localhost:8000**  
Admin panel: **http://localhost:8000/admin/**

<!-- 
baido 
baido.yahoo
 -->

### 3. Frontend Setup (Angular)

#### 3.1. Инсталирай зависимости

```bash
cd frontend
npm install
```

#### 3.2. Стартирай dev server

```bash
ng serve
```

Frontend ще работи на: **http://localhost:4200**

#### 3.3. Build за production

```bash
ng build --configuration production
```

Build файловете ще са в `frontend/dist/browser/`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SECRET_KEY` | Django secret key | `django-insecure-xyz...` | ✅ Yes |
| `DEBUG` | Debug mode | `True` / `False` | ✅ Yes |
| `ALLOWED_HOSTS` | Allowed domains | `localhost,aurexia.estate` | ✅ Yes |
| `DB_NAME` | PostgreSQL database name | `aurexia_db` | ✅ Yes |
| `DB_USER` | Database user | `postgres` | ✅ Yes |
| `DB_PASSWORD` | Database password | `1123QwER` | ✅ Yes |
| `DB_HOST` | Database host | `localhost` (dev) / `db` (Docker) | ✅ Yes |
| `DB_PORT` | Database port | `5432` | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dsla98vyk` | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `587566495847865` | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `sJLzQz...` | ✅ Yes |
| `MAILJET_API_KEY` | Mailjet API key (contact forms) | `a2da51856...` | ✅ Yes |
| `MAILJET_API_SECRET` | Mailjet API secret | `4868f206...` | ✅ Yes |
| `DEFAULT_FROM_EMAIL` | Default sender email | `noreply@aurexia.estate` | ✅ Yes |
| `CONTACT_FORM_RECIPIENT` | Property inquiry recipient | `inquiries@aurexia.estate` | ✅ Yes |
| `BASE_URL` | Frontend URL | `http://localhost:4200` | ✅ Yes |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:4200` | ✅ Yes |

### Production Environment

> ⚠️ **Note**: Production deployment configuration is in progress.

За production deployment, environment variables трябва да включват:

1. Всички променливи от таблицата по-горе
2. `DEBUG=False` (задължително!)
3. `ALLOWED_HOSTS` с production domain(s): `aurexia.estate,www.aurexia.estate`
4. `DB_HOST` с remote PostgreSQL hostname
5. Production URLs за `BASE_URL` и `CORS_ALLOWED_ORIGINS`
6. Cloudinary настройки с production cloud
7. Mailjet API credentials за production email sending

---

## 🗄️ База данни

### PostgreSQL Schema

Проектът използва **PostgreSQL 15** (`aurexia_db`) с два Django апп-а:

#### ⭐ Real Estate Models (`api_aurexia`) - NEW

**Destination** - Luxury locations (Dubai, Spain, Switzerland...)
- `name_en`, `name_bg` - Bilingual destination names
- `description_en`, `description_bg` - SEO-optimized descriptions
- `hero_image`, `thumbnail_image` - CloudinaryField with folder structure
- `slug` - Auto-generated URL-friendly identifier
- `is_featured`, `is_active` - Visibility controls
- `@property active_properties_count` - Dynamic property count

**Property** - Luxury real estate listings
- `title_en`, `title_bg`, `description_en`, `description_bg` - Bilingual content
- `destination` (FK) - Links to Destination
- `features` (M2M) - Many-to-many with PropertyFeature
- `property_type` - VILLA, APARTMENT, PENTHOUSE, MANSION, ESTATE, LAND
- `status` - AVAILABLE, RESERVED, SOLD, OFF_MARKET
- `price`, `currency` - Pricing with EUR/USD/GBP/CHF support
- `bedrooms`, `bathrooms`, `area_sqm`, `plot_size_sqm` - Property specs
- `address`, `city`, `latitude`, `longitude` - Location details
- `featured_image` - CloudinaryField hero image
- `slug` - Unique URL-friendly identifier with collision handling
- `views_count` - Tracking for analytics
- `@property formatted_price` - Human-readable price (e.g., "€4.5M")

**PropertyFeature** - Amenities (Pool, Gym, Security, etc.)
- `name_en`, `name_bg` - Bilingual feature names
- `icon` - Font Awesome icon class (e.g., "fa-swimming-pool")
- `order` - Display ordering

**PropertyImage** - Property gallery images
- `property` (FK) - Links to Property
- `image` - CloudinaryField with aurexia/properties/gallery/ folder
- `caption_en`, `caption_bg` - Image descriptions
- `order` - Display order in gallery

**PropertyInquiry** - Contact form submissions
- `property` (FK, nullable) - Optional link to specific property
- `full_name`, `email`, `phone`, `message` - Contact details
- `budget_range`, `preferred_contact_method` - Client preferences
- `is_contacted`, `contacted_at`, `notes` - Staff tracking fields

**InvestorListing** - Premium realtors/agencies
- `company_name`, `contact_person`, `email`, `phone` - Company details
- `subscription_status` - TRIAL, ACTIVE, SUSPENDED, CANCELLED
- `subscription_start`, `subscription_end` - Subscription period
- `monthly_fee`, `properties_count` - Business metrics
- `is_active` - Visibility control

**PropertyFeatureLink** - Explicit M2M through table
- `property` (FK), `feature` (FK) - Many-to-many relationship

#### Content Models (`api_generix`) - UPDATED

**HeroSlide** - Homepage hero carousel
- `title_en`, `title_bg`, `description_en`, `description_bg` - Bilingual content
- `cta_text`, `cta_link`, `background_image` - Call-to-action and background
- `is_active`, `order` - Visibility and ordering

**Achievement** - Statistics section (e.g., "50+ Properties", "5 Countries")
- `number`, `label_en`, `label_bg`, `icon_class` - Achievement display
- `order` - Display ordering

**Partner** - Partner logos carousel
- `name`, `logo_image`, `website_url` - Partner details
- `is_active`, `order` - Visibility and ordering

**AboutUsTestimonial** - About page testimonials (singleton)
- `testimonial_text_en`, `testimonial_text_bg` - Bilingual testimonial
- `author_name`, `author_title_en`, `author_title_bg` - Author details
- `author_image` - CloudinaryField for author photo
- `is_active` - Visibility control

**CallToAction** - CTA sections (e.g., "Schedule a Viewing")
- `title_en`, `title_bg`, `description_en`, `description_bg` - Bilingual content
- `button_text_en`, `button_text_bg`, `button_link` - Call-to-action button
- `style` - GRADIENT, DARK, LIGHT
- `background_image_url` - Optional background
- `is_active`, `order` - Visibility and ordering

**ThemeSettings** - Global dark luxury theme (singleton)
- **Dark Palette**: `primary_color` (#0a0a0a), `surface_color` (#1a1a1a), `dark_surface` (#0f0f0f)
- **Gold Accents**: `accent_gold` (#c9a84c), `hover_gold` (#b39440)
- **Text Colors**: `text_primary` (#ffffff), `text_secondary` (#a0a0a0), `text_muted` (#707070)
- **Borders**: `border_color` (#2a2a2a), `border_hover` (#3a3a3a)
- Typography: Cormorant Garamond (headings), Montserrat (body)

**TestimonialCard** - Client reviews
- `client_name`, `client_image`, `testimonial_text_en`, `testimonial_text_bg`
- `rating` (1-5), `is_active`, `order` - Review details

**ContactPageContent** - Contact page content (singleton)
- `title_en`, `title_bg`, `subtitle_en`, `subtitle_bg` - Page header
- `address`, `phone`, `email`, `working_hours_en`, `working_hours_bg` - Contact info
- `background_image` - Page hero image
- `is_active` - Visibility control

**CacheSettings** - API caching configuration (singleton)
- `cache_enabled`, `cache_timeout` - Cache control

#### User Models (`api_auth`)

**CustomUser** - Extended Django User
- Email authentication с built-in User модел
- Profile image, email verification tracking

### Database Migrations

```bash
# Create new migrations
python manage.py makemigrations

# Apply all migrations
python manage.py migrate

# View migration status
python manage.py showmigrations

# View specific app migrations
python manage.py showmigrations api_aurexia
python manage.py showmigrations api_generix

# Rollback migration (example)
python manage.py migrate api_aurexia 0001
```

### Database Backup & Restore

**Backup:**
```bash
# Local PostgreSQL
pg_dump -U postgres aurexia_db > aurexia_backup.sql

# Docker PostgreSQL
docker exec postgres-aurexia pg_dump -U postgres aurexia_db > aurexia_backup.sql
```

**Restore:**
```bash
# Local PostgreSQL
psql -U postgres aurexia_db < aurexia_backup.sql

# Docker PostgreSQL
docker exec -i postgres-aurexia psql -U postgres aurexia_db < aurexia_backup.sql
```

> **Note**: The project includes a legacy `generix_db_backup.sql` file from the previous platform version.

---

## ⚡ Функционалности

### 🎨 Frontend Features (TO BE UPDATED)

#### 1. **Responsive Design**
- Mobile-first approach
- Optimized for all devices
- Dark luxury theme (#0a0a0a, #c9a84c gold accents)
- Touch-friendly navigation

#### 2. **Bilingual Support (EN/BG)**
- Dynamic language switching
- Translation files: `assets/i18n/bg.json`, `assets/i18n/en.json`

```typescript
// Usage example
{{ 'destinations.hero.title' | translate }}
```

#### 3. **Property Search & Filtering**
- Advanced search by price, bedrooms, area
- Filter by destination, property type, status
- Real-time results
- Price range sliders

#### 4. **Property Gallery**
- Full-screen image gallery
- Swipeable on mobile
- Lightbox with captions
- Cloudinary optimized images

#### 5. **Interactive Maps**
- Property location markers
- Google Maps / Leaflet integration
- Destination exploration

#### 6. **Property Inquiry Forms**
- Contact forms for each property
- Budget range selection
- Preferred contact method
- Lead tracking in Django Admin

#### 7. **SEO Optimization**
- **Meta tags** - Property-specific titles, descriptions
- **Open Graph** - Social media sharing with property images
- **Twitter Cards** - Twitter listing previews
- **Sitemap.xml** - Auto-generated property URLs
- **Structured Data** - JSON-LD schema for real estate
- **Canonical URLs**

#### 8. **Smooth Animations**
- CSS animations: `fadeIn`, `fadeInUp`, `fadeInLeft`, `fadeInRight`
- Parallax scrolling effects
- Hover animations for property cards

#### 9. **Smart Loading**
- Skeleton loaders
- Lazy loading for property images
- Progressive image loading
- Infinite scroll for property listings

### 🔧 Backend Features

#### 1. **⭐ RESTful API с Django REST Framework**
- **Aurexia API v2.0** - `/api/aurexia/`
- **ViewSet architecture** with custom actions
- **Advanced filtering** (django-filter) - Filter by destination, type, status, price
- **Full-text search** - Search properties by title, description, city
- **Ordering** - Sort by price, date, area, bedrooms
- **Pagination** - Efficient data loading
- **CORS enabled** - Frontend integration
- **Bilingual responses** - EN/BG field support

#### 2. **Django Admin Panel**
- **Property Management** - Create/edit luxury properties
- **Destination Management** - Manage locations
- **Feature Management** - Add property amenities
- **Inquiry Tracking** - View/manage property inquiries with bulk actions
- **Investor Management** - Manage premium listings with subscription tracking
- **Image Galleries** - Inline image upload/ordering
- **Cloudinary Integration** - Direct upload to CDN
- **Cache Control** - API caching settings
- **Theme Settings** - Dark luxury color customization

#### 3. **Authentication System**
- User registration
- Login/Logout
- Token-based auth (JWT ready)
- Email verification
- Password reset (email)

#### 4. **⭐ Property Management System - NEW**

**Features:**
- **Multi-language content** - EN/BG for all text fields
- **Property types** - Villa, Apartment, Penthouse, Mansion, Estate, Land
- **Status tracking** - Available, Reserved, Sold, Off-Market
- **Advanced specs** - Bedrooms, bathrooms, area (sqm), plot size
- **Geolocation** - Address, city, latitude/longitude
- **Price formatting** - Auto-formatted display (e.g., "€4.5M")
- **View tracking** - Analytics for popular properties
- **Featured properties** - Highlight premium listings
- **Slug auto-generation** - SEO-friendly URLs with collision handling

**Property Features (M2M):**
- Swimming Pool, Gym, Sea View, Garden, Security, Parking, Elevator, Balcony, Terrace, etc.
- Icon support (Font Awesome)
- Custom ordering

**Image Galleries:**
- Multiple images per property
- Captions (EN/BG)
- Custom ordering
- Cloudinary optimization

#### 5. **Email System (Mailjet)**

**Aurexia Estate** използва **Mailjet** за изпращане на property inquiry notifications.

**Overview:**
Generix използва **Mailjet** за изпращане на email notifications от contact форма.

**Features:**
- Contact form email notifications
- HTML email templates
- Email validation
- Deliverability tracking
- Detailed statistics (opens, clicks, bounces)

**Mailjet Setup:**

1. **Създай Mailjet акаунт**
   - Регистрирай се на [Mailjet.com](https://www.mailjet.com/)
   - **Free plan**: 200 emails/ден (6000/месец) безплатно

2. **Вземи API credentials**
   - Влез в Mailjet Dashboard
   - Отиди в **Account Settings** → **REST API**
   - Копирай **API Key** и **Secret Key**

3. **Конфигурирай в проекта**

   Добави credentials в `backend/.env`:
   ```env
   MAILJET_API_KEY=your-mailjet-api-key
   MAILJET_API_SECRET=your-mailjet-api-secret
   DEFAULT_FROM_EMAIL=noreply@aurexia.estate
   CONTACT_FORM_RECIPIENT=inquiries@aurexia.estate
   ```

4. **Потвърди sender domain (препоръчително)**
   - В Mailjet Dashboard → **Sender domains & addresses**
   - Добави твоя домейн (например: `aurexia.estate`)
   - Следвай инструкциите за DNS verification
   - След verification може да изпращаш от `noreply@aurexia.estate`

5. **Тестване**

   **Вариант 1: Django Management Command**
   ```bash
   cd backend
   python scripts/send_test_email.py
   ```

   **Вариант 2: Contact форма**
   - Отвори frontend (`http://localhost:4200/contact`)
   - Попълни контакт форма
   - Провери Mailjet Dashboard → **Statistics** за доставка

**Django Settings (настроени):**

```python
# backend/generix/settings.py

# Email backend
EMAIL_BACKEND = 'django_mailjet.backends.MailjetBackend'

# Mailjet API
MAILJET_API_KEY = config('MAILJET_API_KEY', default='...')
MAILJET_API_SECRET = config('MAILJET_API_SECRET', default='...')
MAILJET_API_VERSION = 'v3.1'

# Email settings
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@aurexia.estate')
CONTACT_FORM_RECIPIENT = config('CONTACT_FORM_RECIPIENT', default='inquiries@aurexia.estate')
MAILJET_TEMPLATE_LANGUAGE = 'bg'  # Български език
```

**API Usage Example:**

Contact form submission (`api_generix/views.py`):

```python
from mailjet_rest import Client
from django.conf import settings

def send_contact_email(name, email, phone, message):
    """Send contact form email via Mailjet"""
    mailjet = Client(
        auth=(settings.MAILJET_API_KEY, settings.MAILJET_API_SECRET),
        version='v3.1'
    )
    
    data = {
        'Messages': [
            {
                "From": {
                    "Email": settings.DEFAULT_FROM_EMAIL,
                    "Name": "Generix Contact Form"
                },
                "To": [
                    {
                        "Email": settings.CONTACT_FORM_RECIPIENT,
                        "Name": "Generix Team"
                    }
                ],
                "Subject": f"New Contact Form Submission from {name}",
                "TextPart": f"Name: {name}\nEmail: {email}\nPhone: {phone}\n\nMessage:\n{message}",
                "HTMLPart": f"""
                    <h3>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                    <h4>Message:</h4>
                    <p>{message}</p>
                """
            }
        ]
    }
    
    result = mailjet.send.create(data=data)
    return result.status_code == 200
```

**Advanced: Email Templates (опционално)**

За по-сложни HTML templates:

1. Създай template в Mailjet Dashboard → **Transactional** → **Templates**
2. Design HTML template с variables
3. Използвай template ID в кода:

```python
data = {
    'Messages': [
        {
            "From": {"Email": "noreply@generix.app", "Name": "Generix"},
            "To": [{"Email": user_email, "Name": user_name}],
            "TemplateID": 123456,  # Template ID from Mailjet
            "TemplateLanguage": True,
            "Subject": "Welcome to Generix",
            "Variables": {
                "user_name": user_name,
                "verification_link": verification_url
            }
        }
    ]
}
```

**Monitoring & Statistics:**

В Mailjet Dashboard можеш да проследяваш:
- ✉️ **Sent** - изпратени emails
- ✅ **Delivered** - доставени emails
- 👁️ **Opened** - отворени emails
- 🖱️ **Clicked** - кликнати линкове
- ⚠️ **Bounced** - неуспешни доставки
- 🚫 **Spam complaints** - spam оплаквания

**Troubleshooting:**

**Problem:** Emails не се изпращат
- ✅ Провери дали API credentials са правилни
- ✅ Провери Mailjet Dashboard logs
- ✅ Увери се, че sender email е verified

**Problem:** Emails отиват в spam
- ✅ Verify твоя domain в Mailjet
- ✅ Добави SPF/DKIM DNS records
- ✅ Използвай dedicated sender address

**Resources:**
- [Mailjet Documentation](https://dev.mailjet.com/)
- [Mailjet Python Library](https://github.com/mailjet/mailjet-apiv3-python)
- [Django-Mailjet](https://github.com/mailjet/django-mailjet)

#### 5. **Image Management (Cloudinary)**
- CDN delivery
- Automatic optimization
- Responsive images
- Image transformations
- Cloud storage

#### 6. **Security**
- CSRF protection
- CORS configuration
- SQL injection prevention
- XSS protection
- Secure password hashing

#### 7. **Static Files**
- WhiteNoise middleware
- Compressed static files
- Cache headers
- Production-ready serving

---

## 📡 API Documentation

### Base URL

**Development**: `http://localhost:8000/api/`  
**Production**: `TBD`

### API Version: 2.0

**Root Endpoint** - `GET /api/`
```json
{
  "message": "Welcome to Aurexia Estate API",
  "version": "2.0",
  "endpoints": {
    "auth": "/api/auth/",
    "generix": "/api/generix/",
    "aurexia": "/api/aurexia/"
  }
}
```

---

### ⭐ Aurexia Estate API (`/api/aurexia/`) - NEW

#### Destinations

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/destinations/` | GET | List all destinations | No |
| `/destinations/{id}/` | GET | Destination details | No |
| `/destinations/featured/` | GET | Featured destinations | No |

**Query Parameters:**
- `?is_featured=true` - Filter featured destinations
- `?is_active=true` - Filter active destinations

**Example Response** - `GET /api/aurexia/destinations/`:
```json
[
  {
    "id": 1,
    "name_en": "Dubai Marina",
    "name_bg": "Дубай Марина",
    "description_en": "Luxurious waterfront living...",
    "description_bg": "Луксозен живот на брега...",
    "hero_image": "https://res.cloudinary.com/.../dubai-hero.jpg",
    "thumbnail_image": "https://res.cloudinary.com/.../dubai-thumb.jpg",
    "slug": "dubai-marina",
    "is_featured": true,
    "is_active": true,
    "active_properties_count": 12
  }
]
```

#### Properties

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/properties/` | GET | List all properties | No |
| `/properties/{id}/` | GET | Property details (increments views) | No |
| `/properties/featured/` | GET | Featured properties | No |
| `/properties/by_destination/?destination={slug}` | GET | Properties by destination | No |
| `/properties/search/` | GET | Advanced search | No |

**Filtering & Search:**
- `?destination__slug=dubai-marina` - Filter by destination
- `?property_type=VILLA` - Filter by type
- `?status=AVAILABLE` - Filter by status
- `?search=sea view` - Full-text search in title/description/city
- `?ordering=-price` - Order by price descending
- `?ordering=created_at` - Order by date ascending

**Advanced Search Parameters:**
- `?min_price=1000000` - Minimum price
- `?max_price=5000000` - Maximum price
- `?min_bedrooms=3` - Minimum bedrooms
- `?min_area=200` - Minimum area in sqm

**Example Response** - `GET /api/aurexia/properties/`:
```json
[
  {
    "id": 1,
    "title_en": "Luxury Beachfront Villa",
    "title_bg": "Луксозна вила на плажа",
    "description_en": "Stunning 4-bedroom villa...",
    "description_bg": "Зашеметяваща вила с 4 спални...",
    "destination": {
      "id": 1,
      "name_en": "Dubai Marina",
      "slug": "dubai-marina"
    },
    "property_type": "VILLA",
    "status": "AVAILABLE",
    "price": "4500000.00",
    "currency": "EUR",
    "formatted_price": "€4.5M",
    "bedrooms": 4,
    "bathrooms": 5,
    "area_sqm": "450.00",
    "plot_size_sqm": "800.00",
    "address": "Palm Jumeirah",
    "city": "Dubai",
    "latitude": "25.1124",
    "longitude": "55.1390",
    "featured_image": "https://res.cloudinary.com/.../villa.jpg",
    "slug": "luxury-beachfront-villa-dubai",
    "views_count": 156,
    "is_featured": true,
    "is_active": true,
    "features": [
      {
        "id": 1,
        "name_en": "Swimming Pool",
        "icon": "fa-swimming-pool"
      }
    ],
    "images": [
      {
        "id": 1,
        "image": "https://res.cloudinary.com/.../gallery1.jpg",
        "caption_en": "Living room view",
        "order": 1
      }
    ],
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

#### Property Features

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/features/` | GET | List all features | No |
| `/features/{id}/` | GET | Feature details | No |

**Example Response** - `GET /api/aurexia/features/`:
```json
[
  {
    "id": 1,
    "name_en": "Swimming Pool",
    "name_bg": "Басейн",
    "icon": "fa-swimming-pool",
    "order": 1
  }
]
```

#### Property Inquiries

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/inquiries/` | POST | Submit property inquiry | No |
| `/inquiries/` | GET | List inquiries (admin) | Yes (Admin) |
| `/inquiries/{id}/` | PATCH | Update inquiry (admin) | Yes (Admin) |

**POST Request Body**:
```json
{
  "property": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+971501234567",
  "message": "I'm interested in this property",
  "budget_range": "€3M - €5M",
  "preferred_contact_method": "EMAIL"
}
```

**Response**:
```json
{
  "id": 1,
  "property": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+971501234567",
  "message": "I'm interested in this property",
  "budget_range": "€3M - €5M",
  "preferred_contact_method": "EMAIL",
  "is_contacted": false,
  "contacted_at": null,
  "created_at": "2025-01-15T11:00:00Z"
}
```

#### Investor Listings (Admin Only)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/investors/` | GET | List investors | Yes (Admin) |
| `/investors/{id}/` | GET/PATCH/DELETE | Manage investor | Yes (Admin) |
| `/investors/active/` | GET | Active investors | Yes (Admin) |

**Filters:**
- `?subscription_status=ACTIVE`
- `?is_active=true`

---

### Content API (`/api/generix/`)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/hero-slides/` | GET | Homepage hero carousel | No |
| `/achievements/` | GET | Statistics section | No |
| `/partners/` | GET | Partner logos | No |
| `/about-testimonial/` | GET | About page testimonial | No |
| `/call-to-action/` | GET | CTA sections | No |
| `/theme-settings/` | GET | Dark luxury theme colors | No |
| `/testimonials/` | GET | Client reviews | No |
| `/contact-page/` | GET | Contact page content | No |
| `/cache-settings/` | GET | Cache configuration | No |

### Authentication API (`/api/auth/`)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/register/` | POST | User registration | No |
| `/login/` | POST | User login | No |
| `/logout/` | POST | User logout | Yes |
| `/user/` | GET | Get user profile | Yes |

---

## 🎨 Frontend Структура (TO BE UPDATED)

### Core Services

**`cache.service.ts`** - Cache management
```typescript
// Browser console commands
cache.status()   // Check cache status
cache.list()     // List cached items
cache.clear()    // Clear cache
cache.refresh()  // Sync with backend
cache.help()     // Show all commands
```

**`translation.service.ts`** - i18n service
```typescript
// Get translation
translation.t('destinations.hero.title')

// Change language
translation.setLanguage('bg')
translation.setLanguage('en')

// Get current language
translation.currentLang
```

**`seo.service.ts`** - SEO meta tags
```typescript
// Update meta tags for properties
seo.updateTitle('Luxury Villa in Dubai Marina - Aurexia Estate')
seo.updateDescription('4-bedroom beachfront villa...')
seo.updateKeywords('dubai real estate, luxury villa, beachfront property')
seo.updateOgTags({ title, description, image, url })
```

### Services (API calls) - TO BE CREATED

**`destination.service.ts`** - Destinations API ⭐ NEW
**`property.service.ts`** - Properties API with filtering/search ⭐ NEW
**`inquiry.service.ts`** - Property inquiry forms ⭐ NEW
**`feature.service.ts`** - Property features API ⭐ NEW
**`contact.service.ts`** - Contact form API (existing)

### Routing (TO BE UPDATED)

```typescript
// Planned Routes
/                         -> Home (hero with featured properties)
/destinations             -> Destinations listing
/destinations/:slug       -> Destination detail with properties
/properties               -> All properties with filters
/properties/:slug         -> Property detail page
/property-inquiry/:id     -> Property inquiry form
/about                    -> About Aurexia Estate
/contact                  -> Contact page
/login                    -> Login
/register                 -> Register
/privacy-policy           -> Privacy Policy
/cookie-policy            -> Cookie Policy
```

---

## 🏛️ Backend Структура

### Django Apps

**`api_auth`** - Authentication
- User registration & login
- Email verification
- Password reset
- JWT token handling (ready)

**`api_generix`** - Reusable content ✅ UPDATED
- HeroSlide, Achievement, Partner (bilingual)
- AboutUsTestimonial, CallToAction
- ThemeSettings (dark luxury colors)
- TestimonialCard, ContactPageContent
- CacheSettings
- API views with caching
- Serializers
- Admin configuration

**`api_aurexia`** - Real Estate Platform ⭐ NEW
- **Models**: Destination, Property, PropertyFeature, PropertyImage, PropertyInquiry, InvestorListing
- **ViewSets**: Full CRUD with filtering, search, ordering, custom actions
- **Serializers**: List/Detail variants for optimized responses
- **Admin**: Property management with inlines, bulk actions, search
- **URLs**: Router-based REST endpoints at `/api/aurexia/`

### URL Configuration

```python
# backend/generix/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api_auth.urls')),
    path('api/generix/', include('api_generix.urls')),
]
```

### Django Admin

**Custom admin features:**
- Cloudinary image upload widget
- Rich text editor
- Inline editing
- Bulk actions
- Search & filtering

**Access:**
- Development: `http://localhost:8000/admin/`
- Production: `http://generix.publicvm.com/admin/`

---

## 💾 Angular Caching System

Проектът използва **интелигентна система за кеширане** на API заявки в браузъра за по-добра производителност и UX.

### 🎯 Как работи?

1. **HTTP Interceptor** - автоматично кешира всички GET заявки към `/api/generix/`
2. **Smart Loading** - skeleton loaders се показват само ако заявката отнема повече от 100ms
3. **Django Admin контрол** - кешът може да се включва/изключва от Admin панела
4. **Browser Cache** - данните се запазват в паметта на браузъра за моментално зареждане

### ⚙️ Конфигурация

#### Django Admin контрол
Кешът се контролира от Django Admin:
```
/admin/api_generix/cachesettings/
```

**Настройки:**
- `cache_enabled` - включва/изключва кеширането (TRUE/FALSE)
- `cache_timeout` - време за живот на кеша в секунди (по подразбиране: 1800 = 30 мин)

#### Синхронизация с Frontend
Angular автоматично проверява настройките на кеша на всеки **2 минути** и синхронизира състоянието.

### 🛠️ Използване

#### За собственика на сайта (редактиране на съдържание):

**Вариант 1: От Django Admin**
1. Отвори `/admin/api_generix/cachesettings/`
2. Постави `cache_enabled = False`
3. Запази промените
4. Редактирай съдържанието в Admin панела
5. Refresh страницата - ще видиш новото съдържание веднага
6. Включи обратно `cache_enabled = True`

**Вариант 2: От Browser Console** (бързо)
```javascript
// Отвори Chrome DevTools (F12) -> Console tab

cache.status()        // Вижда текущото състояние на кеша
cache.list()          // Показва всички кеширани елементи
cache.clear()         // Изчиства целия кеш
cache.refresh()       // Синхронизира с Django Admin настройките
cache.help()          // Показва всички налични команди
```

**Workflow за редактиране:**
```javascript
// 1. Изчисти кеша
cache.clear()

// 2. Редактирай в Django Admin
// 3. Refresh страницата - вижда се новото съдържание

// 4. Ако кешът е изключен, включи го обратно от Admin
cache.refresh()  // Синхронизира настройките
```

### 📊 Предимства на системата

✅ **Моментално зареждане** - данните се зареждат от паметта (без HTTP заявки)  
✅ **Smooth UX** - няма премигване на skeleton loaders при кеширани данни  
✅ **Намалени заявки** - по-малко натоварване на сървъра  
✅ **Smart Loading** - skeleton loader само когато има реално забавяне (> 100ms)  
✅ **Лесна редакция** - собственикът може да изключи кеша с 1 клик  
✅ **Автоматична синхронизация** - Frontend се синхронизира с Backend на всеки 2 мин  

### 🔧 Технически детайли

**Файлове:**
- `frontend/src/app/core/services/cache.service.ts` - Cache Service
- `frontend/src/app/core/interceptors/cache.interceptor.ts` - HTTP Interceptor
- `backend/generix/api_generix/models.py` - CacheSettings Model
- `backend/generix/api_generix/views.py` - get_cache_settings endpoint

**Кеширани endpoints:**
- Hero Slides
- Platform Cards & Features
- Why Generix Section & Case Studies
- About Us Testimonial & Hero
- Call to Action
- Testimonials
- Contact Page Content

**Cache Key формат:**
```
{url}?lang={language}
```

**Кешът НЕ се прилага за:**
- POST/PUT/DELETE заявки
- `/api/generix/cache-settings/` endpoint (за да избегнем рекурсия)
- Заявки извън `/api/generix/` scope

### 🐛 Debugging

**Провери дали кешът работи:**
```javascript
// В конзолата
cache.status()
```

**Виж какво е кеширано:**
```javascript
cache.list()
```

**Изчисти кеша за тестване:**
```javascript
cache.clear()
```

**Проследи заявките в Network tab:**
- Кеширани заявки → няма HTTP request в Network
- Не-кеширани → виждаш HTTP GET request

**Конзолни съобщения:**
```
✅ Cache HIT: hero-slides       // Данните са от кеша
❌ Cache MISS - fetching: ...    // Прави нова заявка
🔄 Cache disabled by Django Admin // Кешът е изключен
💾 Cache SET: ...                // Запазва в кеша
```

// В конзолата:
cache.status()  // Виж статуса на кеша
cache.list()    // Виж какво е кеширано
cache.clear()   // Изчисти кеша и направи refresh


---

## 🚀 Deployment

### Current Status: Development

> ⚠️ **Note**: Production deployment is not yet configured. The platform is in active development.

### Production Checklist (Future)

- [ ] Choose hosting platform (AWS, DigitalOcean, Azure, etc.)
- [ ] Configure production PostgreSQL database
- [ ] Set up Cloudinary production folders
- [ ] Configure domain (aurexia.estate)
- [ ] SSL certificates (Let's Encrypt)
- [ ] Environment variables for production
- [ ] Nginx configuration
- [ ] Gunicorn configuration
- [ ] Docker setup (optional)
- [ ] CI/CD pipeline

### Planned Deployment Stack

- **Platform**: Docker on Ubuntu Server / AWS EC2 / Azure VM
- **Database**: PostgreSQL 15 (managed or Docker)
- **Web Server**: Nginx (Reverse Proxy) + Gunicorn (Backend)
- **Frontend**: Angular build (served via Nginx)
- **CDN**: Cloudinary (property images)
- **Email**: Mailjet (property inquiries)

### Deployment Reference

Detailed Docker deployment guide: **[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)** (from previous Generix version)

**Deployment Process (when ready):**
1. Update environment variables for production
2. Run Django migrations: `python manage.py migrate`
3. Collect static files: `python manage.py collectstatic`
4. Build Angular frontend: `ng build --configuration production`
5. Configure Nginx reverse proxy
6. Start Gunicorn: `gunicorn generix.wsgi:application`
7. Configure SSL with Certbot

### Environment Variables (Production)

See [Environment Variables](#-environment-variables) section for required settings.

**Critical Production Settings:**
- `DEBUG=False`
- `ALLOWED_HOSTS=aurexia.estate,www.aurexia.estate`
- `DB_HOST=<production-database-host>`
- `CLOUDINARY_*` production credentials
- `MAILJET_*` production credentials

---

## 🧪 Тестване

### Backend Tests

```bash
cd backend

# Run all tests
python manage.py test

# Run specific app tests
python manage.py test api_generix
python manage.py test api_auth

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generates htmlcov/index.html
```

### Frontend Tests

```bash
cd frontend

# Unit tests
ng test

# E2E tests
ng e2e

# Code coverage
ng test --code-coverage
```

### API Testing

**Manual testing с curl:**

```bash
# Test API root
curl http://localhost:8000/api/

# Get destinations
curl http://localhost:8000/api/aurexia/destinations/

# Get properties
curl http://localhost:8000/api/aurexia/properties/

# Get featured properties
curl http://localhost:8000/api/aurexia/properties/featured/

# Search properties
curl "http://localhost:8000/api/aurexia/properties/search/?min_price=1000000&max_price=5000000&min_bedrooms=3"

# Submit property inquiry
curl -X POST http://localhost:8000/api/aurexia/inquiries/ \
  -H "Content-Type: application/json" \
  -d '{"property":1,"full_name":"Test User","email":"test@example.com","phone":"+971501234567","message":"Interested in this property","budget_range":"€3M - €5M","preferred_contact_method":"EMAIL"}'
```

**Postman/Insomnia:**
- Import API collection
- Test all endpoints
- Verify responses

---

## ⚠️ Known Issues & Development Status

### Backend Status: ✅ COMPLETE
- All Aurexia models implemented and migrated
- API endpoints working with filtering, search, ordering
- Django admin fully configured
- Database running successfully

### Frontend Status: 🔄 IN DEVELOPMENT
- Angular components need to be updated for Aurexia Estate
- Property listing pages to be created
- Destination pages to be created
- Property detail pages with inquiry forms to be created
- Dark luxury theme to be applied

### Current Limitations:

#### 1. Frontend Not Yet Updated
**Status**: Backend complete, frontend pending
**TODO**: 
- Create destination.service.ts, property.service.ts, inquiry.service.ts
- Build destination-list, property-list, property-detail components
- Implement property search and filtering UI
- Apply dark theme (#0a0a0a, #c9a84c)

#### 2. No Test Data
**Status**: Database is empty (fresh migrations)
**TODO**: 
- Create superuser for Django Admin access
- Add sample destinations (Dubai, Spain, Switzerland, etc.)
- Add property features (Pool, Gym, Security, etc.)
- Add sample properties with images

#### 3. Email Configuration
**Status**: Mailjet credentials configured but not tested
**TODO**: 
- Test property inquiry email notifications
- Configure email templates for Aurexia branding

---

## 🔮 Roadmap - Aurexia Estate

### Phase 1: Frontend Development (Current Priority)

#### Angular Services
- [ ] Create `destination.service.ts` with REST API integration
- [ ] Create `property.service.ts` with filtering/search
- [ ] Create `inquiry.service.ts` for contact forms
- [ ] Create TypeScript interfaces for all models

#### Core Pages
- [ ] **Destinations Page** - Grid/list of luxury locations
- [ ] **Destination Detail** - Properties in specific destination
- [ ] **Properties Listing** - Filterable property grid with search
- [ ] **Property Detail** - Full property page with gallery, specs, inquiry form
- [ ] **Property Search** - Advanced search with price/beds/area filters

#### UI Components
- [ ] **Property Card** - Reusable property display component
- [ ] **Property Gallery** - Lightbox image gallery component
- [ ] **Property Inquiry Form** - Contact form for specific property
- [ ] **Search Filters** - Price range, bedrooms, area, type selectors
- [ ] **Property Map** - Interactive map with property markers

#### Dark Luxury Theme
- [ ] Apply `#0a0a0a` primary color globally
- [ ] Apply `#c9a84c` gold accents for CTAs and highlights
- [ ] Update typography to Cormorant Garamond + Montserrat
- [ ] Create luxury hover effects and animations
- [ ] Update all existing components with dark theme

### Phase 2: Content & Testing (1-2 weeks)

#### Data Population
- [ ] Create Django superuser
- [ ] Add 5+ destinations with hero images
- [ ] Add 15+ property features
- [ ] Add 10+ sample properties with galleries
- [ ] Test all API endpoints with real data

#### Email Integration
- [ ] Test property inquiry emails with Mailjet
- [ ] Create HTML email templates for Aurexia branding
- [ ] Configure auto-response emails for inquiries

#### SEO & Analytics
- [ ] Update sitemap.xml with property URLs
- [ ] Configure Open Graph images for properties
- [ ] Add Google Analytics tracking
- [ ] Structured data (JSON-LD) for real estate listings

### Phase 3: Production Deployment (2-4 weeks)

#### Infrastructure
- [ ] Configure production database
- [ ] Set up production Cloudinary folders
- [ ] Configure production domain (aurexia.estate)
- [ ] SSL certificates
- [ ] Environment variables for production

#### Performance
- [ ] Redis caching for API endpoints
- [ ] Cloudinary image optimization (responsive, WebP)
- [ ] Frontend lazy loading and code splitting
- [ ] CDN configuration

#### Security
- [ ] Django security checklist
- [ ] Rate limiting for API endpoints
- [ ] CSRF protection
- [ ] SQL injection prevention audit

### Phase 4: Advanced Features (Future)

#### Investor Portal
- [ ] Investor dashboard with property management
- [ ] Subscription management UI
- [ ] Analytics for property views/inquiries
- [ ] Multi-property bulk upload

#### Client Features
- [ ] User accounts for property favorites
- [ ] Property comparison tool
- [ ] Property alerts based on criteria
- [ ] Mortgage calculator

#### Marketing
- [ ] Blog system for luxury real estate content
- [ ] Newsletter subscription
- [ ] Social media integration
- [ ] WhatsApp/Telegram inquiry integration

---

## 📚 Документация

### External Resources

**Django:**
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [django-filter](https://django-filter.readthedocs.io/)

**Angular:**
- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [ngx-translate](https://github.com/ngx-translate/core)

**Third-party Services:**
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Mailjet API](https://dev.mailjet.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Internal Documentation

- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - Complete refactoring documentation (Generix → Aurexia)
- **[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)** - Docker deployment guide
- **[backend/.env](./backend/.env)** - Environment variables (not in repo, create locally)
- **[frontend/COLOR_SYSTEM.md](./frontend/COLOR_SYSTEM.md)** - Color palette documentation

---

## 🤝 Contributing

For contributing to the Aurexia Estate project:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/PropertyGallery`)
3. Commit changes (`git commit -m 'Add property gallery component'`)
4. Push to branch (`git push origin feature/PropertyGallery`)
5. Open Pull Request

### Code Style

**Python (Backend):**
- Follow PEP 8
- Use descriptive variable names
- Add docstrings to all functions/classes
- Max line length: 120 characters

**TypeScript (Frontend):**
- Follow Angular Style Guide
- Use Prettier formatter
- ESLint configuration
- TypeScript strict mode

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 👨‍💻 Author

**Aurexia Estate Development Team**

- Platform: Luxury Real Estate Connector
- Email: inquiries@aurexia.estate
- GitHub: [@Andon-ov](https://github.com/Andon-ov)

**Previous Version:** Generix App (refactored to Aurexia Estate in January 2025)

---

## 🙏 Acknowledgments

- Django & Django REST Framework team
- Angular Team
- Cloudinary for CDN & image optimization
- Mailjet for email delivery
- PostgreSQL team
- Font Awesome for icons
- All open-source contributors

**Technology Stack:**
- Django 5.2.5 + DRF 3.16.1 + django-filter 25.1
- Angular 19
- PostgreSQL 15
- Cloudinary 1.44.1
- Mailjet REST API

---

**Made with ❤️ for luxury real estate by Aurexia Estate Team**

