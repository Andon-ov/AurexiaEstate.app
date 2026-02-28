# Image Fields Fix - Deployment Instructions

## Проблем
Image полетата бяха `CloudinaryField` (очакват file upload), но ние подаваме URL strings.

## Решение
Променихме всички image полета на `URLField` за директно слагане на URLs.

## Стъпки на сървъра (192.168.1.41)

### 1. SSH към сървъра
```bash
ssh your-user@192.168.1.41
```

### 2. Отиди в проекта
```bash
cd ~/AurexiaEstate.app
```

### 3. Дръпни промените
```bash
git pull origin main
```

### 4. Спри контейнерите
```bash
docker compose down
```

### 5. Rebuild backend (ВАЖНО!)
```bash
docker compose build backend --no-cache
```

### 6. Пусни database
```bash
docker compose up -d postgres
sleep 5
```

### 7. Пусни backend
```bash
docker compose up -d backend
sleep 5
```

### 8. Приложи миграцията
```bash
docker exec aurexia-backend python manage.py migrate
```

### 9. Изтрий старите данни (CloudinaryField формат)
```bash
docker exec -it aurexia-backend python manage.py shell
```

В shell-а:
```python
from generix.api_aurexia.models import Destination, Property
Destination.objects.all().delete()
Property.objects.all().delete()
print("✅ Deleted old data")
exit()
```

### 10. Пусни новите данни с URL-и
```bash
docker exec aurexia-backend python manage.py populate_figma_data
```

### 11. Пусни frontend
```bash
docker compose up -d frontend
```

### 12. Провери
```bash
# API
curl -s http://aurexia.run.place/api/aurexia/properties/featured/ | jq

# Browser
# http://aurexia.run.place
```

## Какво се промени

### Преди (CloudinaryField):
```python
hero_image = CloudinaryField(
    "Hero Image",
    folder='aurexia/destinations/heroes',
    help_text="Large hero image for destination page"
)
```

### Сега (URLField):
```python
hero_image = models.URLField(
    max_length=500,
    verbose_name="Hero Image URL",
    help_text="Large hero image URL for destination page (e.g., from Cloudinary, Unsplash)"
)
```

## Как работи сега

В Admin панела просто слагаш пълен URL на снимка:
```
https://images.unsplash.com/photo-1234567890/villa.jpg?w=1920&q=80
https://res.cloudinary.com/dsla98vyk/image/upload/v1234/property.jpg
```

## Ако има грешка

Виж логовете:
```bash
docker logs aurexia-backend --tail 50
```

Рестартирай всичко:
```bash
docker compose down
docker compose up -d
```
