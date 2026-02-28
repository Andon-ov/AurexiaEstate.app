import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface CacheSettings {
  cache_enabled: boolean;
  cache_timeout: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private apiUrl = `${environment.apiUrl}/aurexia/cache-settings/`;
  private cacheEnabled = true;
  private cacheDuration = 30 * 60 * 1000; // Default 30 minutes
  private cache = new Map<string, CacheEntry>();
  private httpClient?: HttpClient;
  
  // Observable for cache status
  private cacheEnabledSubject = new BehaviorSubject<boolean>(true);
  public cacheEnabled$ = this.cacheEnabledSubject.asObservable();

  constructor(private injector: Injector) {
    // Defer all initialization to avoid circular dependency with interceptors
    // Interceptors depend on CacheService, and CacheService needs HttpClient,
    // which depends on interceptors being registered first
    setTimeout(() => {
      this.initializeCache();
      this.startSyncWithBackend();
    }, 0);
    this.exposeToConsole();
  }
  
  /**
   * Lazy-load HttpClient to avoid circular dependency
   */
  private getHttpClient(): HttpClient {
    if (!this.httpClient) {
      this.httpClient = this.injector.get(HttpClient);
    }
    return this.httpClient;
  }

  /**
   * Initialize cache from localStorage and backend
   */
  private initializeCache(): void {
    // Load from localStorage first (for instant availability)
    const savedEnabled = localStorage.getItem('cache_enabled');
    const savedTimeout = localStorage.getItem('cache_timeout');
    
    if (savedEnabled !== null) {
      this.cacheEnabled = savedEnabled === 'true';
      this.cacheEnabledSubject.next(this.cacheEnabled);
    }
    
    if (savedTimeout !== null) {
      this.cacheDuration = parseInt(savedTimeout, 10) * 1000;
    }

    // Sync with backend immediately (already deferred in constructor)
    this.syncWithBackend();
  }

  /**
   * Start periodic sync with Django backend (every 2 minutes)
   */
  private startSyncWithBackend(): void {
    interval(2 * 60 * 1000).subscribe(() => {
      this.syncWithBackend();
    });
  }

  /**
   * Sync cache settings with Django Admin
   */
  private syncWithBackend(): void {
    this.getHttpClient().get<CacheSettings>(this.apiUrl).pipe(
      tap((settings: CacheSettings) => {
        const wasEnabled = this.cacheEnabled;
        this.cacheEnabled = settings.cache_enabled;
        this.cacheDuration = settings.cache_timeout * 1000;
        
        // Update localStorage
        localStorage.setItem('cache_enabled', settings.cache_enabled.toString());
        localStorage.setItem('cache_timeout', settings.cache_timeout.toString());
        
        // Emit new status
        this.cacheEnabledSubject.next(this.cacheEnabled);
        
        // Clear cache if disabled
        if (wasEnabled && !this.cacheEnabled) {
          this.clearCache();
          console.log('🔄 Cache disabled by Django Admin');
        } else if (!wasEnabled && this.cacheEnabled) {
          console.log('🔄 Cache enabled by Django Admin');
        }
      }),
      catchError(error => {
        console.warn('Failed to sync cache settings with backend:', error);
        return [];
      })
    ).subscribe();
  }

  /**
   * Check if cache is enabled
   */
  isCacheEnabled(): boolean {
    return this.cacheEnabled;
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    if (!this.cacheEnabled) {
      return null;
    }

    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.timestamp;
    if (age < this.cacheDuration) {
      console.log(`✅ Cache HIT: ${this.truncateKey(key)}`);
      return cached.data;
    }

    // Expired - remove from cache
    this.cache.delete(key);
    console.log(`⏰ Cache EXPIRED: ${this.truncateKey(key)}`);
    return null;
  }

  /**
   * Set data to cache
   */
  set<T>(key: string, data: T): void {
    if (!this.cacheEnabled) {
      return;
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`💾 Cache SET: ${this.truncateKey(key)}`);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cache cleared (${size} items removed)`);
  }

  /**
   * Clear cache for specific key
   */
  clearCacheForKey(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ Cache cleared for: ${this.truncateKey(key)}`);
  }

  /**
   * Clear cache by URL pattern
   */
  clearCacheByPattern(pattern: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`🗑️ Cache cleared for pattern "${pattern}" (${count} items removed)`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { enabled: boolean; size: number; duration: number } {
    return {
      enabled: this.cacheEnabled,
      size: this.cache.size,
      duration: this.cacheDuration / 1000 // in seconds
    };
  }

  /**
   * Truncate key for logging
   */
  private truncateKey(key: string): string {
    return key.length > 80 ? key.substring(0, 80) + '...' : key;
  }

  /**
   * Expose cache control to browser console
   */
  private exposeToConsole(): void {
    (window as any).cache = {
      status: () => {
        const stats = this.getCacheStats();
        console.log('╔════════════════════════════════════════╗');
        console.log('║         CACHE STATUS                   ║');
        console.log('╠════════════════════════════════════════╣');
        console.log(`║ Enabled:  ${stats.enabled ? '✅ YES' : '❌ NO'}                        ║`);
        console.log(`║ Items:    ${stats.size.toString().padEnd(28)} ║`);
        console.log(`║ Duration: ${stats.duration}s (${Math.floor(stats.duration / 60)} min)${' '.repeat(18 - stats.duration.toString().length)} ║`);
        console.log('╚════════════════════════════════════════╝');
        console.log('\n💡 Cache is controlled by Django Admin at /admin/api_generix/cachesettings/');
      },
      
      list: () => {
        if (this.cache.size === 0) {
          console.log('📭 Cache is empty');
          return;
        }
        
        const items = Array.from(this.cache.entries()).map(([key, value]) => ({
          url: key.length > 60 ? key.substring(0, 60) + '...' : key,
          age: `${Math.floor((Date.now() - value.timestamp) / 1000)}s`,
          size: `${(JSON.stringify(value.data).length / 1024).toFixed(2)} KB`,
          expires_in: `${Math.floor((this.cacheDuration - (Date.now() - value.timestamp)) / 1000)}s`
        }));
        
        console.table(items);
      },
      
      clear: () => {
        this.clearCache();
      },
      
      refresh: () => {
        console.log('🔄 Syncing with Django Admin...');
        this.syncWithBackend();
      },
      
      help: () => {
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║              CACHE CONTROL COMMANDS                        ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║ cache.status()  - Show cache status and settings          ║');
        console.log('║ cache.list()    - List all cached items with details      ║');
        console.log('║ cache.clear()   - Clear all cached data                   ║');
        console.log('║ cache.refresh() - Sync settings with Django Admin         ║');
        console.log('║ cache.help()    - Show this help message                  ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║ 💡 Cache is controlled from Django Admin:                 ║');
        console.log('║    /admin/api_generix/cachesettings/                       ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
      }
    };

    // Show welcome message
    console.log('%c💾 Cache Service Initialized', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    console.log('%cType cache.help() for available commands', 'color: #999; font-size: 12px;');
  }
}
