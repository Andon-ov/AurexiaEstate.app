import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests to our API
    if (req.method !== 'GET' || !this.shouldCache(req.url)) {
      return next.handle(req);
    }

    // Don't cache if cache is disabled
    if (!this.cacheService.isCacheEnabled()) {
      // Removed verbose logging - cache status shown in CacheService
      return next.handle(req);
    }

    // Try to get from cache
    const cacheKey = req.urlWithParams;
    const cachedResponse = this.cacheService.get<HttpResponse<any>>(cacheKey);
    
    if (cachedResponse) {
      // Return cached response as Observable
      return of(cachedResponse.clone());
    }

    // Not in cache - make request and cache the response
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.set(cacheKey, event.clone());
        }
      })
    );
  }

  /**
   * Check if URL should be cached
   */
  private shouldCache(url: string): boolean {
    // Cache API endpoints (not cache-settings itself to avoid recursion)
    return url.includes('/api/aurexia/') && !url.includes('/cache-settings/');
  }

  /**
   * Get URL summary for logging
   */
  private getUrlSummary(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      const lastPart = pathParts[pathParts.length - 1] || 'root';
      return lastPart.length > 30 ? lastPart.substring(0, 30) + '...' : lastPart;
    } catch {
      return url.substring(0, 30);
    }
  }
}
