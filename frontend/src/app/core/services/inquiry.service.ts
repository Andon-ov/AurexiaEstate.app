import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyInquiryCreate, PropertyInquiryResponse } from '../models/inquiry.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/aurexia/inquiries/`;

  submitInquiry(inquiry: PropertyInquiryCreate): Observable<PropertyInquiryResponse> {
    return this.http.post<PropertyInquiryResponse>(this.apiUrl, inquiry);
  }
}
