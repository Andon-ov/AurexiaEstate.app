from django.db import migrations, models

class Migration(migrations.Migration):
    """
    Migration to make the email field of the User model unique.
    This prevents multiple accounts with the same email address.
    """

    dependencies = [
        ('api_auth', '0004_fix_duplicate_emails'),
    ]

    operations = [
        migrations.RunSQL(
            # Make email unique
            "ALTER TABLE auth_user ADD CONSTRAINT unique_email UNIQUE (email);",
            # Remove uniqueness on rollback
            "ALTER TABLE auth_user DROP CONSTRAINT IF EXISTS unique_email;"
        ),
    ]