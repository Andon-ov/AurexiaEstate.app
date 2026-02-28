import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyListItem, PropertyDetail, PropertyFeature, PropertySearchParams } from '../models/property.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/aurexia/properties/`;
  private featuresUrl = `${environment.apiUrl}/aurexia/features/`;

  getProperties(): Observable<PropertyListItem[]> {
    return this.http.get<PropertyListItem[]>(this.apiUrl);
  }

  getPropertyBySlug(slug: string): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.apiUrl}${slug}/`);
  }

  getFeaturedProperties(): Observable<PropertyListItem[]> {
    return this.http.get<PropertyListItem[]>(`${this.apiUrl}featured/`);
  }

  getPropertiesByDestination(destinationSlug: string): Observable<PropertyListItem[]> {
    return this.http.get<PropertyListItem[]>(`${this.apiUrl}destination/${destinationSlug}/`);
  }

  searchProperties(params: PropertySearchParams): Observable<PropertyListItem[]> {
    let httpParams = new HttpParams();

    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.min_price) httpParams = httpParams.set('min_price', params.min_price.toString());
    if (params.max_price) httpParams = httpParams.set('max_price', params.max_price.toString());
    if (params.min_beds) httpParams = httpParams.set('min_beds', params.min_beds.toString());
    if (params.max_beds) httpParams = httpParams.set('max_beds', params.max_beds.toString());
    if (params.min_area) httpParams = httpParams.set('min_area', params.min_area.toString());
    if (params.max_area) httpParams = httpParams.set('max_area', params.max_area.toString());
    if (params.destination__slug) httpParams = httpParams.set('destination__slug', params.destination__slug);
    if (params.property_type) httpParams = httpParams.set('property_type', params.property_type);
    if (params.ordering) httpParams = httpParams.set('ordering', params.ordering);

    return this.http.get<PropertyListItem[]>(`${this.apiUrl}search/`, { params: httpParams });
  }

  getFeatures(): Observable<PropertyFeature[]> {
    return this.http.get<PropertyFeature[]>(this.featuresUrl);
  }
}
