"""
Django management command to create superuser automatically
Usage: python manage.py create_superuser_if_none_exists

Environment variables required:
- DJANGO_SUPERUSER_USERNAME (default: admin)
- DJANGO_SUPERUSER_EMAIL (default: admin@example.com)
- DJANGO_SUPERUSER_PASSWORD (default: admin123)
"""
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Create superuser automatically if none exists'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Get credentials from environment variables
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

        # Check if any superuser exists
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(
                self.style.WARNING(
                    f'Superuser already exists. Skipping creation.'
                )
            )
            return

        # Create superuser
        try:
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'✓ Superuser "{username}" created successfully!'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'✗ Error creating superuser: {e}'
                )
            )
