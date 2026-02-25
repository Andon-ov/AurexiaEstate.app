"""
Utilities for sending emails using Mailjet API
"""

from django.conf import settings
import logging
import json
import base64
import requests

# Configure logging
logger = logging.getLogger(__name__)

def send_verification_email_with_mailjet(user, token):
    """
    Send email verification using Mailjet API directly with requests library
    
    Args:
        user: User object
        token: EmailVerificationToken object
    """
    try:
        # Create verification URL
        verify_url = f"{settings.BASE_URL}/verify-email/{token.token}"
        
        # Get user display name
        display_name = user.get_full_name() or user.username
        
        # Проверка за наличието на API ключове
        if not settings.MAILJET_API_KEY or not settings.MAILJET_API_SECRET:
            logger.error("Mailjet API keys are not configured in settings")
            raise ValueError("Mailjet API keys are not configured")
        
        # Generate email content
        html_content = render_verification_email(user, verify_url, settings.EMAIL_VERIFICATION_TIMEOUT_DAYS)
        text_content = f"""
            Здравейте {display_name},
            
            Моля, потвърдете Вашия имейл адрес като кликнете на този линк:
            {verify_url}
            
            Линкът ще изтече след {settings.EMAIL_VERIFICATION_TIMEOUT_DAYS} дни.
            
            Поздрави,
            Екипът на Generix
        """
        
        logger.debug(f"Preparing email data for sending to {user.email}")
        
        # Prepare data for Mailjet API
        payload = {
            'Messages': [
                {
                    "From": {
                        "Email": settings.DEFAULT_FROM_EMAIL,
                        "Name": "Generix Приложение"
                    },
                    "To": [
                        {
                            "Email": user.email,
                            "Name": display_name
                        }
                    ],
                    "Subject": "Потвърдете Вашия имейл адрес - Generix",
                    "HTMLPart": html_content,
                    "TextPart": text_content,
                    "CustomID": f"verification-{user.id}-{token.token[:8]}",
                    "CustomCampaign": "email-verification"
                }
            ]
        }
        
        # Create authentication header
        auth_string = f"{settings.MAILJET_API_KEY}:{settings.MAILJET_API_SECRET}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
        
        # Set headers
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Basic {auth_b64}'
        }
        
        # Define API endpoint (with version)
        api_version = getattr(settings, 'MAILJET_API_VERSION', 'v3.1')
        url = f'https://api.mailjet.com/{api_version}/send'
        
        logger.info(f"Sending verification email to {user.email} via Mailjet API")
        
        # Send API request
        response = requests.post(url, headers=headers, json=payload)
        
        # Check response
        if response.status_code == 200:
            logger.info(f"Email sent successfully via Mailjet API: {response.status_code}")
            # Return similar object to what mailjet_rest would return
            return type('ApiResponse', (), {'status_code': response.status_code, 'json': lambda: response.json(), 'text': response.text})
        else:
            logger.warning(f"Mailjet API returned non-200 status code: {response.status_code}")
            try:
                error_data = response.json()
                logger.error(f"Error details: {json.dumps(error_data)}")
            except:
                logger.error(f"Error response: {response.text}")
            
            # Return response object with similar interface
            return type('ApiResponse', (), {'status_code': response.status_code, 'json': lambda: response.json(), 'text': response.text})
        
    except Exception as e:
        logger.error(f"Error in send_verification_email_with_mailjet: {str(e)}", exc_info=True)
        raise


def render_verification_email(user, verify_url, expiry_days):
    """
    Render HTML email for verification without using Django templates
    Simple alternative that doesn't require Django templating
    
    Args:
        user: User object
        verify_url: Verification URL with token
        expiry_days: Days until token expiry
    """
    display_name = user.get_full_name() or user.username
    
    return f"""
    <!DOCTYPE html>
    <html lang="bg">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Потвърдете Вашия имейл - Generix</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .logo {{
                text-align: center;
                margin-bottom: 20px;
            }}
            .container {{
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 20px;
                background-color: #f9f9f9;
            }}
            .button {{
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="logo">
            <h2>Generix</h2>
        </div>
        <div class="container">
            <h2>Потвърдете Вашия имейл адрес</h2>
            <p>Здравейте {display_name},</p>
            <p>Благодарим Ви за регистрацията в Generix. За да завършите процеса и да потвърдите имейл адреса си, моля кликнете върху бутона по-долу:</p>
            
            <p style="text-align: center;">
                <a href="{verify_url}" class="button">Потвърди имейл адрес</a>
            </p>
            
            <p>Ако бутонът не работи, моля копирайте и поставете следния линк в браузъра си:</p>
            <p><a href="{verify_url}">{verify_url}</a></p>
            
            <p>Този линк за потвърждение ще изтече след {expiry_days} дни.</p>
            
            <p>Ако не сте създали акаунт в Generix, можете спокойно да игнорирате това съобщение.</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Generix. Всички права запазени.</p>
            <p>Това е автоматично съобщение, моля не отговаряйте на този имейл.</p>
        </div>
    </body>
    </html>
    """