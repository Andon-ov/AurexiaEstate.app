import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CustomersSection {
  title: string;
  subtitle: string;
}

export interface Achievement {
  title: string;
  count: string;
}

export interface Partner {
  name: string;
  logoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/generix`;

  /**
   * Get customers section header
   * @param lang Language code (en or bg)
   */
  getSection(lang: string = 'en'): Observable<CustomersSection> {
    return this.http.get<CustomersSection>(`${this.apiUrl}/achievements/`, {
      params: { lang }
    });
  }

  /**
   * Get all active achievements
   * @param lang Language code (en or bg)
   */
  getAchievements(lang: string = 'en'): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${environment.apiUrl}/generix/achievements/`, {
      params: { lang }
    });
  }

  /**
   * Get all active partner logos
   */
  getPartners(): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${environment.apiUrl}/generix/partners/`);
  }
}
