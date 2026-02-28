import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AboutUsTestimonial {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorQuote: string;
  authorImage: string;
}

export interface AboutPageHero {
  heroTitle: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
}

export interface AboutPageAchievementsHeader {
  title: string;
  subtitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get About Us testimonial (for homepage)
   * @param lang Language code ('en' or 'bg')
   * @returns Observable with testimonial data
   */
  getTestimonial(lang: string): Observable<AboutUsTestimonial> {
    return this.http.get<AboutUsTestimonial>(
      `${this.apiUrl}/generix/about-testimonial/`,
      { params: { lang } }
    );
  }

  /**
   * Get About Page Hero & Content (for /about page)
   * @param lang Language code ('en' or 'bg')
   * @returns Observable with hero and content data
   */
  getAboutPageHero(lang: string): Observable<AboutPageHero> {
    return this.http.get<AboutPageHero>(
      `${this.apiUrl}/generix/about-testimonial/`,
      { params: { lang } }
    );
  }

  /**
   * Get About Page Achievements Section Header
   * @param lang Language code ('en' or 'bg')
   * @returns Observable with achievements header data
   */
  getAchievementsHeader(lang: string): Observable<AboutPageAchievementsHeader> {
    return this.http.get<AboutPageAchievementsHeader>(
      `${this.apiUrl}/generix/achievements/`,
      { params: { lang } }
    );
  }
}
