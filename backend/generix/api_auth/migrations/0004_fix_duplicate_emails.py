from django.db import migrations, models

def fix_duplicate_emails(apps, schema_editor):
    """
    Find users with duplicate emails and append a unique suffix to make them unique.
    This prevents the uniqueness constraint from failing when added.
    """
    User = apps.get_model('auth', 'User')
    # Get all email addresses with counts
    email_counts = {}
    for user in User.objects.all():
        email = user.email.lower() if user.email else ''
        if email:
            if email in email_counts:
                email_counts[email].append(user.id)
            else:
                email_counts[email] = [user.id]
    
    # Fix duplicates
    for email, user_ids in email_counts.items():
        if len(user_ids) > 1:
            # Skip the first user (keep original)
            for i, user_id in enumerate(user_ids[1:], 1):
                user = User.objects.get(id=user_id)
                user.email = f"{email}.{i}"
                user.save()


class Migration(migrations.Migration):
    """
    Migration to fix duplicate email addresses before adding the uniqueness constraint.
    """

    dependencies = [
        ('api_auth', '0003_emailverificationtoken'),
    ]

    operations = [
        migrations.RunPython(fix_duplicate_emails, migrations.RunPython.noop),
    ]