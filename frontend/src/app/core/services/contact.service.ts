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
  email?: string; // Optional email field that might be added later
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Use environment API URL instead of hardcoded localhost
  private apiUrl: string = `${environment.apiUrl}/generix/contact-page/`;
  
  constructor(private http: HttpClient) {}
  
  /**
   * Send contact form data to backend for email processing
   * @param formData The contact form data to be sent
   * @returns An Observable with the API response
   */
  sendContactForm(formData: ContactFormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: false
    });
  }
}