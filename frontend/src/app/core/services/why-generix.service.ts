import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WhyGenerixSection {
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  buttonText: string;
  buttonLink: string;
}

export interface CaseStudySlide {
  title: string;
  category: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  overlayImage: string;
}

@Injectable({
  providedIn: 'root'
})
export class WhyGenerixService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get Why Generix section content
   * @param lang Language code ('en' or 'bg')
   * @returns Observable with section data
   */
  getSection(lang: string): Observable<WhyGenerixSection> {
    return this.http.get<WhyGenerixSection>(
      `${this.apiUrl}/generix/cta/`,
      { params: { lang } }
    );
  }

  /**
   * Get case study slides
   * @param lang Language code ('en' or 'bg')
   * @returns Observable with array of case study slides
   */
  getCaseStudies(lang: string): Observable<CaseStudySlide[]> {
    return this.http.get<CaseStudySlide[]>(
      `${this.apiUrl}/generix/testimonials/`,
      { params: { lang } }
    );
  }
}
