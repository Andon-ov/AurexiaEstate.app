import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactPageContent {
  heroTitle: string;
  title: string;
  subtitle: string;
  addressLine1: string;
  addressLine2: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/generix/contact-page/`;

  constructor(private http: HttpClient) {}

  getContactContent(lang: string): Observable<ContactPageContent> {
    return this.http.get<ContactPageContent>(`${this.apiUrl}?lang=${lang}`);
  }
}
