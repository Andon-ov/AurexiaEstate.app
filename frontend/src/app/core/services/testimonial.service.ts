import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestimonialCard } from '../models/testimonials-slider-card.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/generix/testimonials/`;

  /**
   * Get all active testimonial cards
   * @param lang Language code (en or bg)
   * @returns Observable of TestimonialCard array
   */
  getTestimonials(lang: string = 'en'): Observable<TestimonialCard[]> {
    return this.http.get<TestimonialCard[]>(this.apiUrl, {
      params: { lang }
    });
  }
}
