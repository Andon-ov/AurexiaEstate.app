# Generated manually on 2026-02-28
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_aurexia', '0002_cachesettingsproxy_contactpagecontentproxy_and_more'),
    ]

    operations = [
        # Destination image fields
        migrations.AlterField(
            model_name='destination',
            name='hero_image',
            field=models.URLField(
                max_length=500,
                verbose_name='Hero Image URL',
                help_text='Large hero image URL for destination page (e.g., from Cloudinary, Unsplash)'
            ),
        ),
        migrations.AlterField(
            model_name='destination',
            name='thumbnail_image',
            field=models.URLField(
                max_length=500,
                verbose_name='Thumbnail Image URL',
                help_text='Thumbnail URL for destination cards'
            ),
        ),
        
        # Property featured_image field
        migrations.AlterField(
            model_name='property',
            name='featured_image',
            field=models.URLField(
                max_length=500,
                verbose_name='Featured Image URL',
                help_text='Main property image URL (e.g., from Cloudinary, Unsplash)'
            ),
        ),
        
        # PropertyImage gallery field
        migrations.AlterField(
            model_name='propertyimage',
            name='image',
            field=models.URLField(
                max_length=500,
                verbose_name='Image URL',
                help_text='Gallery image URL (e.g., from Cloudinary, Unsplash)'
            ),
        ),
    ]
