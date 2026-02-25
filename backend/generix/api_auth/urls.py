from django.urls import path
from generix.api_auth.views import (
    RegisterApiView, 
    LoginApiView, 
    LogoutApiView, 
    UserProfileView,
    ChangePasswordView,
    UpdateProfileView,
    VerifyEmailView,
    ResendVerificationEmailView
)

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterApiView.as_view(), name='api_register_user'),
    path('login/', LoginApiView.as_view(), name='api_login_user'),
    path('logout/', LogoutApiView.as_view(), name='api_logout_user'),
    
    # Profile endpoints
    path('profile/', UserProfileView.as_view(), name='api_user_profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='api_update_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='api_change_password'),
    
    # Email verification endpoints
    path('verify-email/<str:token>/', VerifyEmailView.as_view(), name='api_verify_email'),
    path('resend-verification-email/', ResendVerificationEmailView.as_view(), name='api_resend_verification_email'),
]
