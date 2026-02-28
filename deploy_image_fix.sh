#!/bin/bash
# Deployment script for image field changes
# Run on server: ssh your-user@192.168.1.41
# cd ~/AurexiaEstate.app && chmod +x deploy_image_fix.sh && ./deploy_image_fix.sh

set -e  # Exit on error

echo "🔄 Pulling latest changes..."
git pull origin main

echo "🛑 Stopping containers..."
docker compose down

echo "🏗️  Rebuilding backend container with new code..."
docker compose build backend --no-cache

echo "▶️  Starting database..."
docker compose up -d db
echo "⏳ Waiting for postgres..."
sleep 5

echo "▶️  Starting backend..."
docker compose up -d backend
echo "⏳ Waiting for backend to initialize..."
sleep 8

echo "🗃️  Running migrations to change image fields to URLField..."
docker exec aurexia-backend python manage.py migrate

echo "🗑️  Clearing old CloudinaryField data..."
docker exec aurexia-backend python manage.py shell -c "
from generix.api_aurexia.models import Destination, Property
# Clear existing data to avoid CloudinaryField format conflicts
Destination.objects.all().delete()
Property.objects.all().delete()
print('✅ Old data cleared')
"

echo "📊 Populating with new URL-based image data..."
docker exec aurexia-backend python manage.py populate_figma_data

echo "▶️  Starting frontend and nginx..."
docker compose up -d frontend nginx

echo ""
echo "✅ Deployment complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Website: http://aurexia.run.place"
echo "📊 API: http://aurexia.run.place/api/aurexia/properties/featured/"
echo "🔧 Admin: http://aurexia.run.place/admin/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
