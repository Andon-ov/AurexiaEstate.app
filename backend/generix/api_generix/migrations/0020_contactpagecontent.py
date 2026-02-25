# Generated migration for ContactPageContent model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_generix', '0019_themesettings_color_background_alt'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactPageContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_title_en', models.CharField(default='Get in Touch', help_text='Main hero section title in English', max_length=200, verbose_name='Hero Title (English)')),
                ('title_en', models.CharField(default='Contact Information', help_text='Contact section title in English', max_length=200, verbose_name='Section Title (English)')),
                ('subtitle_en', models.TextField(default="We'd love to hear from you. Send us a message and we'll respond as soon as possible.", help_text='Contact section subtitle in English', verbose_name='Subtitle (English)')),
                ('address_line1_en', models.CharField(default='Tsarigradski Complex', help_text='First line of address in English', max_length=200, verbose_name='Address Line 1 (English)')),
                ('address_line2_en', models.CharField(default='Druzhba 2, Sofia, Bulgaria', help_text='Second line of address in English', max_length=200, verbose_name='Address Line 2 (English)')),
                ('email', models.EmailField(default='contact@generix.bg', help_text='Contact email address', max_length=254, verbose_name='Email Address')),
                ('hero_title_bg', models.CharField(default='Свържете се с нас', help_text='Главно hero заглавие на български', max_length=200, verbose_name='Hero заглавие (Български)')),
                ('title_bg', models.CharField(default='Информация за контакт', help_text='Заглавие на контакт секцията на български', max_length=200, verbose_name='Заглавие на секция (Български)')),
                ('subtitle_bg', models.TextField(default='Ще се радваме да чуем от вас. Изпратете ни съобщение и ще отговорим възможно най-скоро.', help_text='Подзаглавие на контакт секцията на български', verbose_name='Подзаглавие (Български)')),
                ('address_line1_bg', models.CharField(default='Комплекс Цариградски', help_text='Първи ред на адреса на български', max_length=200, verbose_name='Адрес ред 1 (Български)')),
                ('address_line2_bg', models.CharField(default='Дружба 2, София, България', help_text='Втори ред на адреса на български', max_length=200, verbose_name='Адрес ред 2 (Български)')),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Contact Page Content',
                'verbose_name_plural': 'Contact Page Content',
            },
        ),
    ]
