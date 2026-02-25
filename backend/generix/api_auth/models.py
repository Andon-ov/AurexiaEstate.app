from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from cloudinary.models import CloudinaryField
from django.utils import timezone
from datetime import timedelta
import secrets
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    profile_image = CloudinaryField('image', folder='profile_images', blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a UserProfile for every new User automatically"""
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save UserProfile when User is saved"""
    instance.profile.save()


class EmailVerificationToken(models.Model):
    """Model to store email verification tokens"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_verification_tokens')
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Verification token for {self.user.email}"
    
    def save(self, *args, **kwargs):
        # Generate random token on creation if not provided
        if not self.token:
            self.token = secrets.token_hex(32)  # 64 characters long
        
        # Set expiry date if not provided
        if not self.expires_at:
            expiry_days = getattr(settings, 'EMAIL_VERIFICATION_TIMEOUT_DAYS', 7)
            self.expires_at = timezone.now() + timedelta(days=expiry_days)
            
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        """Check if token has expired"""
        return self.expires_at < timezone.now()
    
    @classmethod
    def generate_token(cls, user):
        """Generate a new token for a user, invalidating any existing ones"""
        # Mark any existing tokens as used
        cls.objects.filter(user=user, is_used=False).update(is_used=True)
        
        # Create new token
        return cls.objects.create(user=user)
