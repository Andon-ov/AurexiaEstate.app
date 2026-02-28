import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatformCard } from '../models/platform-card.model';
import { PlatformFeature } from '../models/platform-feature.model';
import { environment } from '../../../environments/environment';

export interface PlatformPageResponse {
  platform: PlatformCard;
  features: PlatformFeature[];
}

export interface PlatformsSectionHeader {
  title: string;
  subtitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get platforms section header (title + subtitle)
   * @param lang Language code (en or bg)
   * @returns Observable of header data
   */
  getPlatformsSectionHeader(lang: string = 'en'): Observable<PlatformsSectionHeader> {
    return this.http.get<PlatformsSectionHeader>(
      `${this.apiUrl}/generix/achievements/`,
      { params: { lang } }
    );
  }

  /**
   * Get all active platform cards
   * @param lang Language code (en or bg)
   * @returns Observable of PlatformCard array
   */
  getPlatformCards(lang: string = 'en'): Observable<PlatformCard[]> {
    return this.http.get<PlatformCard[]>(`${this.apiUrl}/generix/partners/`, {
      params: { lang }
    });
  }

  /**
   * Get platform page data (platform info + features) by slug
   * @param slug Platform slug (e.g., 'corporate-business', 'self-service')
   * @param lang Language code ('en' or 'bg')
   * @returns Observable with platform data and features
   */
  getPlatformFeatures(slug: string, lang: string): Observable<PlatformPageResponse> {
    return this.http.get<PlatformPageResponse>(
      `${this.apiUrl}/generix/partners/`,
      { params: { lang } }
    );
  }
}
