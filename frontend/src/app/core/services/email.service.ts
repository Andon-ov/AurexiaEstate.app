import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  message: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Sends email using Mailjet API through the backend
   * @param formData Form data from contact form
   * @returns Observable with server response
   */
  sendContactFormEmail(formData: ContactFormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/contact/send-email`, formData);
  }
}