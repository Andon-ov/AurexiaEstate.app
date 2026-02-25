
from rest_framework import generics as rest_generic_views, views as rest_views, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.shortcuts import get_object_or_404
import logging

from rest_framework.authtoken import views as authtoken_view
from rest_framework.authtoken import models as authtoken_models
from rest_framework.response import Response

# Configure logging
logger = logging.getLogger(__name__)

from generix.api_auth.serializers import (
    CreateUserSerializer, 
    UserSerializer,
    LoginSerializer, 
    ChangePasswordSerializer,
    UpdateUserProfileSerializer,
    UserProfileSerializer
)
from .models import UserProfile, EmailVerificationToken

UserModel = get_user_model()


def send_verification_email(user):
    """Send email verification link to user"""
    # Generate verification token
    token_obj = EmailVerificationToken.generate_token(user)
    
    logger.info(f"Sending verification email to user {user.id} ({user.email})")
    
    try:
        # Check if we should use direct Mailjet API
        if hasattr(settings, 'USE_MAILJET_DIRECT_API') and settings.USE_MAILJET_DIRECT_API:
            # Import here to avoid circular imports
            try:
                from .email_utils import send_verification_email_with_mailjet
                print(f"[INFO] Attempting to send email via Mailjet API to {user.email}")
                result = send_verification_email_with_mailjet(user, token_obj)
                print(f"[INFO] Mailjet API response status: {result.status_code}")
                if result.status_code == 200:
                    print("[INFO] Email sent successfully via Mailjet API!")
                else:
                    print(f"[WARNING] Mailjet API returned status code: {result.status_code}")
            except Exception as e:
                print(f"[ERROR] Error using Mailjet API: {str(e)}")
                print("[INFO] Falling back to Django mail backend")
                # Fall back to Django mail
                send_verification_email_with_django(user, token_obj)
        else:
            # Use standard Django mail with Mailjet backend
            print("[INFO] Using Django mail backend with Mailjet")
            send_verification_email_with_django(user, token_obj)
    except Exception as e:
        print(f"[ERROR] Failed to send verification email: {str(e)}")
        # Log the error but continue - we don't want to prevent user registration
        # just because email sending failed
    
    return token_obj


def send_verification_email_with_django(user, token_obj):
    """Send verification email using Django's send_mail function"""
    # Create verification URL
    verify_url = f"{settings.BASE_URL}/verify-email/{token_obj.token}"
    
    # Create email content
    subject = "Верификация на имейл - Generix"
    
    # We'll still use our template for rendering
    try:
        html_message = render_to_string('email_verification.html', {
            'user': user,
            'verify_url': verify_url,
            'expiry_days': settings.EMAIL_VERIFICATION_TIMEOUT_DAYS
        })
        plain_message = strip_tags(html_message)
        
        # Персонализирани данни за имейла
        display_name = user.get_full_name() or user.username
        
        logger.debug(f"Sending email to {user.email} with subject '{subject}'")
        
        # Подготвяме опциите за Mailjet
        mail_options = {}
        try:
            mail_options = {
                'Variables': {
                    'user_name': display_name,
                    'verification_link': verify_url,
                    'expiry_days': settings.EMAIL_VERIFICATION_TIMEOUT_DAYS
                },
                'CustomID': f'verify-email-{user.id}',
            }
        except Exception as opts_ex:
            logger.warning(f"Could not prepare mail_options: {str(opts_ex)}")
        
        # Send email through Mailjet backend
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=f"Generix App <{settings.DEFAULT_FROM_EMAIL}>",
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
                # Допълнителни опции за Mailjet ако са поддържани
                **({"mail_options": mail_options} if mail_options else {})
            )
            logger.info(f"Email sent successfully to {user.email}")
        except Exception as send_ex:
            logger.error(f"Failed to send email: {str(send_ex)}", exc_info=True)
            
    except Exception as e:
        logger.error(f"Error preparing verification email: {str(e)}", exc_info=True)



class RegisterApiView(rest_generic_views.CreateAPIView):
    """API endpoint for user registration"""
    permission_classes = [AllowAny]
    queryset = UserModel.objects.all()
    serializer_class = CreateUserSerializer
    
    def create(self, request, *args, **kwargs):
        """Override create to better handle validation errors"""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            # Return validation errors with HTTP 400
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the user
        user = serializer.save()
        
        # Send verification email
        try:
            send_verification_email(user)
        except Exception as e:
            # Log error but don't prevent user creation
            print(f"Failed to send verification email: {str(e)}")
            
        # Return created user data with HTTP 201
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class LoginApiView(rest_views.APIView):
    """API endpoint for user login and token generation"""
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = authtoken_models.Token.objects.get_or_create(user=user)
        
        # Get user data with profile information
        user_serializer = UserSerializer(user)
        
        return Response({
            'token': token.key,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)


class LogoutApiView(rest_views.APIView):
    """API endpoint for user logout and token deletion"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Delete the user's token to logout
            request.user.auth_token.delete()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(rest_generic_views.RetrieveUpdateAPIView):
    """API endpoint for viewing and updating user profile"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(rest_views.APIView):
    """API endpoint for changing user password"""
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            # Check old password
            if not request.user.check_password(serializer.validated_data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            request.user.set_password(serializer.validated_data.get("new_password"))
            request.user.save()
            
            # Update session to prevent logout
            update_session_auth_hash(request, request.user)
            
            # Delete existing token and create new one
            if hasattr(request.user, 'auth_token'):
                request.user.auth_token.delete()
            token, created = authtoken_models.Token.objects.get_or_create(user=request.user)
            
            return Response({
                "message": "Password updated successfully.",
                "token": token.key
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateProfileView(rest_views.APIView):
    """API endpoint for updating user profile information"""
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        profile = request.user.profile
        # Handle nested profile data if it exists
        data = request.data.copy()
        if 'profile' in data:
            # Merge profile fields into the root data
            profile_data = data.pop('profile')
            data.update(profile_data)
        
        # Проверка наличия файла изображения профиля и явная обработка
        if 'profile_image' in request.FILES:
            data['profile_image'] = request.FILES['profile_image']
            
        serializer = UpdateUserProfileSerializer(profile, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully.",
                "user": UserSerializer(request.user).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    # Add support for multipart form data and file uploads
    def patch(self, request):
        """Support partial updates with multipart form data"""
        return self.put(request)
        

# Email verification views
class VerifyEmailView(rest_views.APIView):
    """API endpoint for verifying email addresses"""
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        """Verify email using token from URL"""
        token_obj = get_object_or_404(EmailVerificationToken, token=token, is_used=False)
        
        # Check if token has expired
        if token_obj.is_expired:
            return Response({
                "error": "Verification link has expired",
                "message": "Please request a new verification link."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark token as used
        token_obj.is_used = True
        token_obj.save()
        
        # Mark user's email as verified
        user = token_obj.user
        user.profile.is_email_verified = True
        user.profile.save()
        
        return Response({
            "success": True,
            "message": "Your email has been successfully verified."
        }, status=status.HTTP_200_OK)


class ResendVerificationEmailView(rest_views.APIView):
    """API endpoint for resending verification email"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        # Check if email is already verified
        if user.profile.is_email_verified:
            return Response({
                "message": "Your email is already verified."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Send new verification email
        try:
            send_verification_email(user)
            return Response({
                "success": True,
                "message": "Verification email sent successfully."
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": "Failed to send verification email",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Future TODOs:
# 1. Password reset functionality: Allow users to reset their password via email
# 3. Rate limiting: Protect login and registration endpoints from brute-force attacks
# 4. Social authentication: Allow login via Google, Facebook, etc.