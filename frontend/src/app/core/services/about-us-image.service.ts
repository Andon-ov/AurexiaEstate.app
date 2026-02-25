import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AboutUsImageContent {
  imageUrl?: string;
  purposeTitle: string;
  purposeDescription: string;
  purposeText: string;
}

@Injectable({
  providedIn: 'root'
})
export class AboutUsImageService {
  private apiUrl = `${environment.apiUrl}/generix/about-us-image/purpose/`;

  constructor(private http: HttpClient) {}

  /**
   * Get About Us Image "Our Purpose" content
   * @param lang Language code (en or bg)
   * @returns Observable of AboutUsImageContent
   */
  getPurposeContent(lang: string = 'en'): Observable<AboutUsImageContent> {
    return this.http.get<AboutUsImageContent>(this.apiUrl, {
      params: { lang }
    });
  }
}
