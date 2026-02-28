import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HomePageCTA {
  title: string;
  buttonText: string;
  buttonLink: string;
}

export interface CallToAction {
  name: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

@Injectable({
  providedIn: 'root'
})
export class CtaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get Home Page CTA (white version)
   * @param lang Language code ('en' or 'bg')
   * @returns Observable with home page CTA data
   */
  getHomePageCTA(lang: string): Observable<HomePageCTA> {
    return this.http.get<HomePageCTA>(
      `${this.apiUrl}/generix/cta/`,
      { params: { lang } }
    );
  }

  /**
   * Get Call-to-Action by name (gradient version)
   * @param name CTA identifier
   * @param lang Language code ('en' or 'bg')
   * @returns Observable with call-to-action data
   */
  getCallToAction(name: string, lang: string): Observable<CallToAction> {
    return this.http.get<CallToAction>(
      `${this.apiUrl}/generix/cta/${name}/`,
      { params: { lang } }
    );
  }
}
