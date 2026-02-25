#!/usr/bin/env python3
"""
Simple test script for Mailjet API.
Usage: python test_mailjet_direct.py your_email@example.com
"""

import sys
import os
from urllib.parse import urlparse
import json

def test_mailjet_api(recipient_email, api_key, api_secret):
    """
    Test direct connection to Mailjet API without Django dependencies
    """
    print(f"Testing Mailjet API with recipient: {recipient_email}")
    print(f"Using API KEY: {api_key[:5]}...{api_key[-5:]}")
    
    try:
        import requests
        print("✓ requests module imported successfully")
    except ImportError:
        print("✗ Failed to import 'requests' module. Please install it with: pip install requests")
        return False
        
    try:
        # Attempt direct API call to Mailjet
        headers = {
            'Content-Type': 'application/json',
        }
        
        # Create authentication header
        import base64
        auth_string = f"{api_key}:{api_secret}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
        headers['Authorization'] = f'Basic {auth_b64}'
        
        # Create email payload
        payload = {
            'Messages': [
                {
                    "From": {
                        "Email": "noreply@generix.app",
                        "Name": "Generix Test"
                    },
                    "To": [
                        {
                            "Email": recipient_email,
                            "Name": "Test User"
                        }
                    ],
                    "Subject": "Тест на Mailjet API",
                    "HTMLPart": """
                        <h3>Тестов имейл от Mailjet API</h3>
                        <p>Това е тестов имейл изпратен чрез директна заявка към Mailjet API.</p>
                        <p>Ако виждате това съобщение, API ключовете работят правилно!</p>
                    """,
                    "TextPart": "Тестов имейл от Mailjet API\n\nТова е тестов имейл изпратен чрез директна заявка към Mailjet API.\n\nАко виждате това съобщение, API ключовете работят правилно!",
                    "CustomID": "test-direct-api"
                }
            ]
        }
        
        # Send API request
        print("Sending request to Mailjet API...")
        url = 'https://api.mailjet.com/v3.1/send'
        response = requests.post(url, headers=headers, json=payload)
        
        # Check response
        if response.status_code == 200:
            print(f"✓ Email sent successfully! Status code: {response.status_code}")
            print("Response data:")
            print(json.dumps(response.json(), indent=2))
            return True
        else:
            print(f"✗ Failed to send email. Status code: {response.status_code}")
            print("Response data:")
            try:
                print(json.dumps(response.json(), indent=2))
            except:
                print(response.text)
            return False
            
    except Exception as e:
        print(f"✗ Error during API call: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
        

def test_mailjet_rest_library(recipient_email, api_key, api_secret):
    """
    Test connection using mailjet_rest library
    """
    print("\nTesting with mailjet_rest library:")
    
    try:
        from mailjet_rest import Client
        print("✓ mailjet_rest module imported successfully")
    except ImportError:
        print("✗ Failed to import 'mailjet_rest' module. Please install it with: pip install mailjet-rest")
        return False
        
    try:
        # Create client
        print("Creating Mailjet client...")
        mailjet = Client(auth=(api_key, api_secret), version='v3.1')
        
        # Prepare data
        data = {
            'Messages': [
                {
                    "From": {
                        "Email": "noreply@generix.app",
                        "Name": "Generix Test Library"
                    },
                    "To": [
                        {
                            "Email": recipient_email,
                            "Name": "Test User"
                        }
                    ],
                    "Subject": "Тест на mailjet_rest библиотеката",
                    "HTMLPart": """
                        <h3>Тестов имейл от mailjet_rest библиотеката</h3>
                        <p>Това е тестов имейл изпратен чрез библиотеката mailjet_rest.</p>
                        <p>Ако виждате това съобщение, библиотеката работи правилно!</p>
                    """,
                    "TextPart": "Тестов имейл от mailjet_rest библиотеката\n\nТова е тестов имейл изпратен чрез библиотеката mailjet_rest.\n\nАко виждате това съобщение, библиотеката работи правилно!",
                    "CustomID": "test-library"
                }
            ]
        }
        
        # Send request
        print("Sending email through library...")
        result = mailjet.send.create(data=data)
        
        # Check result
        if result.status_code == 200:
            print(f"✓ Email sent successfully with library! Status code: {result.status_code}")
            print("Response data:")
            print(json.dumps(result.json(), indent=2))
            return True
        else:
            print(f"✗ Failed to send email with library. Status code: {result.status_code}")
            print("Response data:")
            try:
                print(json.dumps(result.json(), indent=2))
            except:
                print(result.text)
            return False
            
    except Exception as e:
        print(f"✗ Error using mailjet_rest library: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def read_api_keys():
    """Read API keys from environment or prompt user"""
    api_key = os.environ.get('MAILJET_API_KEY', '')
    api_secret = os.environ.get('MAILJET_API_SECRET', '')
    
    # If keys not in environment, look for them in Django settings
    if not api_key or not api_secret:
        try:
            # Try to get keys from Django settings
            print("Looking for API keys in Django settings...")
            settings_path = '/home/baido-rog/GitHub/generix.app/backend/generix/settings.py'
            
            if os.path.exists(settings_path):
                with open(settings_path, 'r') as f:
                    settings_content = f.read()
                    
                import re
                api_key_match = re.search(r"MAILJET_API_KEY\s*=\s*['\"](.*?)['\"]", settings_content)
                api_secret_match = re.search(r"MAILJET_API_SECRET\s*=\s*['\"](.*?)['\"]", settings_content)
                
                if api_key_match and api_secret_match:
                    api_key = api_key_match.group(1)
                    api_secret = api_secret_match.group(1)
                    print("✓ Found API keys in Django settings")
        except Exception as e:
            print(f"Error reading Django settings: {str(e)}")
    
    # If still not found, prompt user
    if not api_key:
        api_key = input("Enter your Mailjet API Key: ").strip()
    
    if not api_secret:
        api_secret = input("Enter your Mailjet API Secret: ").strip()
    
    return api_key, api_secret


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} recipient@example.com")
        sys.exit(1)
    
    recipient = sys.argv[1]
    
    # Check if email looks valid
    if '@' not in recipient or '.' not in recipient:
        print(f"Error: '{recipient}' does not look like a valid email address")
        sys.exit(1)
    
    # Get API keys
    api_key, api_secret = read_api_keys()
    
    if not api_key or not api_secret:
        print("Error: API Key and Secret are required")
        sys.exit(1)
    
    print("\n=== Testing Mailjet API Connection ===\n")
    
    # Test direct API connection
    api_success = test_mailjet_api(recipient, api_key, api_secret)
    
    # Test using library
    lib_success = test_mailjet_rest_library(recipient, api_key, api_secret)
    
    # Print summary
    print("\n=== TEST SUMMARY ===")
    print(f"Direct API test: {'SUCCESS' if api_success else 'FAILED'}")
    print(f"Library test: {'SUCCESS' if lib_success else 'FAILED'}")
    
    if api_success and lib_success:
        print("\nAll tests passed! Check your inbox for the test emails.")
        sys.exit(0)
    else:
        print("\nSome tests failed. Review the error messages above.")
        sys.exit(1)