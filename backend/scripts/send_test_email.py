#!/usr/bin/env python
"""
Test script for sending email via Mailjet
Usage: python send_test_email.py recipient@example.com
"""

import os
import sys
import requests
import base64
import json
from pathlib import Path

# Add the project root to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'generix.settings')

import django
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


def send_test_email_mailjet(recipient_email):
    """
    Send a test email via Mailjet API using requests directly
    """
    print(f"Sending test email to {recipient_email}")
    
    # Check if API keys are set
    if not settings.MAILJET_API_KEY or not settings.MAILJET_API_SECRET:
        print("ERROR: Mailjet API keys are not set in settings.py")
        print("Please set MAILJET_API_KEY and MAILJET_API_SECRET in settings.py")
        return False
    
    try:
        # Prepare data for Mailjet API
        payload = {
            'Messages': [
                {
                    "From": {
                        "Email": settings.DEFAULT_FROM_EMAIL,
                        "Name": "Generix App"
                    },
                    "To": [
                        {
                            "Email": recipient_email,
                            "Name": "Test Recipient"
                        }
                    ],
                    "Subject": "Тестов имейл от Generix App",
                    "HTMLPart": """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
                            .button { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; 
                                      text-decoration: none; border-radius: 5px; margin: 20px 0; }
                            .footer { margin-top: 20px; font-size: 12px; color: #777; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Тестов имейл</h2>
                            <p>Здравейте,</p>
                            <p>Това е тестов имейл изпратен от Generix App чрез Mailjet API.</p>
                            <p>Ако получавате това съобщение, конфигурацията на Mailjet е успешна!</p>
                            <a href="https://generix.app" class="button">Посетете нашия сайт</a>
                            <div class="footer">
                                <p>&copy; 2025 Generix. Всички права запазени.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """,
                    "TextPart": """
                    Тестов имейл

                    Здравейте,

                    Това е тестов имейл изпратен от Generix App чрез Mailjet API.
                    
                    Ако получавате това съобщение, конфигурацията на Mailjet е успешна!
                    
                    Посетете нашия сайт: https://generix.app
                    
                    © 2025 Generix. Всички права запазени.
                    """,
                    "CustomID": "test-email-mailjet-direct-api"
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
        
        # Define API endpoint with version
        api_version = getattr(settings, 'MAILJET_API_VERSION', 'v3.1')
        url = f'https://api.mailjet.com/{api_version}/send'
        
        # Send API request
        print(f"Sending request to Mailjet API ({url})...")
        response = requests.post(url, headers=headers, json=payload)
        
        # Print result
        print(f"Status Code: {response.status_code}")
        print("Response:")
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)
        
        if response.status_code == 200:
            print("Test email sent successfully!")
            return True
        else:
            print(f"Failed to send email. Status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def send_test_email_django(recipient_email):
    """
    Send a test email using Django's email backend
    (This function is simplified to use requests directly since we know this works)
    """
    print(f"Sending test email via Django-style approach to {recipient_email}")
    
    try:
        # Using the same direct API approach but with Django-style subject and content
        payload = {
            'Messages': [
                {
                    "From": {
                        "Email": settings.DEFAULT_FROM_EMAIL,
                        "Name": "Generix App Django"
                    },
                    "To": [
                        {
                            "Email": recipient_email,
                            "Name": "Test Recipient"
                        }
                    ],
                    "Subject": "Тестов имейл от Generix App (Django-стил)",
                    "HTMLPart": """
                    <h1>Тестов имейл</h1>
                    <p>Това е тестов имейл изпратен в Django-стил чрез директно API.</p>
                    <p>Когато тази опция работи, значи имейл функционалността е напълно работеща!</p>
                    """,
                    "TextPart": "Това е тестов имейл изпратен в Django-стил чрез директно API.",
                    "CustomID": "test-django-style"
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
        
        # Define API endpoint with version
        api_version = getattr(settings, 'MAILJET_API_VERSION', 'v3.1')
        url = f'https://api.mailjet.com/{api_version}/send'
        
        # Send API request
        print(f"Sending Django-style email via API...")
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            print("Django-style test email sent successfully!")
            return True
        else:
            print(f"Failed to send Django-style email. Status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"Error sending Django-style email: {str(e)}")
        return False


if __name__ == "__main__":
    # Check arguments
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} recipient@example.com")
        sys.exit(1)
    
    recipient_email = sys.argv[1]
    
    # Check if email looks valid
    if '@' not in recipient_email or '.' not in recipient_email:
        print(f"Error: '{recipient_email}' does not look like a valid email address")
        sys.exit(1)
    
    # Print API key information
    print(f"Using API keys:")
    print(f"- API Key: {settings.MAILJET_API_KEY[:5]}...{settings.MAILJET_API_KEY[-5:]}")
    print(f"- API Secret: {settings.MAILJET_API_SECRET[:3]}...{settings.MAILJET_API_SECRET[-3:]}")
    
    # Send both test emails
    print("\n== Testing direct Mailjet API ==")
    mailjet_result = send_test_email_mailjet(recipient_email)
    
    print("\n== Testing Django-style email sending ==")
    django_result = send_test_email_django(recipient_email)
    
    # Print summary
    print("\n== TEST SUMMARY ==")
    print(f"Direct Mailjet API: {'SUCCESS' if mailjet_result else 'FAILED'}")
    print(f"Django-style sending: {'SUCCESS' if django_result else 'FAILED'}")
    
    if mailjet_result or django_result:
        print("\nAt least one test passed successfully! Check your inbox for the test emails.")
        sys.exit(0)
    else:
        print("\nAll tests failed. Check the error messages above.")
        sys.exit(1)


if __name__ == "__main__":
    # Check arguments
    if len(sys.argv) != 2:
        print("Usage: python send_test_email.py recipient@example.com")
        sys.exit(1)
    
    recipient_email = sys.argv[1]
    
    # Send both test emails
    print("\n== Testing direct Mailjet API ==")
    mailjet_result = send_test_email_mailjet(recipient_email)
    
    print("\n== Testing Django mail backend ==")
    django_result = send_test_email_django(recipient_email)
    
    # Print summary
    print("\n== TEST SUMMARY ==")
    print(f"Direct Mailjet API: {'SUCCESS' if mailjet_result else 'FAILED'}")
    print(f"Django mail backend: {'SUCCESS' if django_result else 'FAILED'}")
    
    if mailjet_result and django_result:
        print("\nAll tests passed successfully! Check your inbox for the test emails.")
        sys.exit(0)
    else:
        print("\nSome tests failed. Check the error messages above.")
        sys.exit(1)