import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination } from '../models/destination.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/aurexia/destinations/`;

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.apiUrl);
  }

  getDestinationBySlug(slug: string): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}${slug}/`);
  }

  getFeaturedDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}featured/`);
  }
}
