import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroSlide } from '../models/hero-slide.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroSlideService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/generix/hero-slides/`;

  /**
   * Get all active hero slides
   * @param lang Language code (en or bg)
   * @returns Observable of HeroSlide array
   */
  getHeroSlides(lang: string = 'en'): Observable<HeroSlide[]> {
    return this.http.get<HeroSlide[]>(this.apiUrl, {
      params: { lang }
    });
  }
}
