"""
Cache utilities for API views
"""
from functools import wraps
from django.core.cache import cache
from django.http import JsonResponse
from rest_framework.response import Response
from .models import CacheSettings


def conditional_cache(cache_key_prefix):
    """
    Decorator for caching API responses based on CacheSettings
    
    Usage:
        @conditional_cache('hero_slides')
        @api_view(['GET'])
        def my_view(request, lang='en'):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Get cache settings
            cache_settings = CacheSettings.load()
            
            # If cache is disabled, call view directly
            if not cache_settings.cache_enabled:
                return view_func(request, *args, **kwargs)
            
            # Build cache key from prefix and request parameters
            lang = kwargs.get('lang', request.GET.get('lang', 'en'))
            cache_key = f"{cache_key_prefix}_{lang}"
            
            # Add query parameters to cache key if present
            query_params = request.GET.dict()
            if query_params:
                params_str = '_'.join(f"{k}_{v}" for k, v in sorted(query_params.items()))
                cache_key = f"{cache_key}_{params_str}"
            
            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                # Return cached response wrapped in Response object
                return Response(cached_response)
            
            # Call the actual view
            response = view_func(request, *args, **kwargs)
            
            # Cache the response if successful
            if hasattr(response, 'status_code') and response.status_code == 200:
                if isinstance(response, Response):
                    cache.set(cache_key, response.data, cache_settings.cache_timeout)
                elif isinstance(response, JsonResponse):
                    cache.set(cache_key, response.content, cache_settings.cache_timeout)
            
            return response
        
        return wrapper
    return decorator


def clear_cache_for_model(model_name):
    """
    Clear all cache entries for a specific model
    Used in model save() signals
    
    Args:
        model_name: Name of the model (e.g., 'hero_slides', 'platform_cards')
    """
    # Get all cache keys with this prefix
    # Note: This is a simple implementation. For production with Redis,
    # you might want to use pattern matching
    cache_settings = CacheSettings.load()
    if cache_settings.cache_enabled:
        # Clear specific model cache
        for lang in ['en', 'bg']:
            cache.delete(f"{model_name}_{lang}")


def cached_api_view(timeout=None):
    """
    Decorator for caching ViewSet responses based on CacheSettings.
    Compatible with DRF ViewSets.
    
    Args:
        timeout: Optional cache timeout in seconds. If None, uses CacheSettings.cache_timeout
    
    Usage:
        @cached_api_view(timeout=600)
        def list(self, request, *args, **kwargs):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(self, request, *args, **kwargs):
            # Get cache settings
            cache_settings = CacheSettings.load()
            
            # If cache is disabled, call view directly
            if not cache_settings.cache_enabled:
                return view_func(self, request, *args, **kwargs)
            
            # Build cache key from view name, action, and query params
            view_name = self.__class__.__name__
            action = view_func.__name__
            query_string = request.META.get('QUERY_STRING', '')
            cache_key = f"viewset:{view_name}:{action}:{query_string}"
            
            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                return Response(cached_response)
            
            # Call the actual view
            response = view_func(self, request, *args, **kwargs)
            
            # Cache the response if successful
            if isinstance(response, Response) and response.status_code == 200:
                cache_timeout = timeout if timeout is not None else cache_settings.cache_timeout
                cache.set(cache_key, response.data, cache_timeout)
            
            return response
        
        return wrapper
    return decorator
