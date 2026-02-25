// core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  /**
   * Sends a POST request to register a new user.
   * @param userData User's registration data (username, email, password).
   * @returns An Observable with the server response.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register/`, userData);
  }

  /**
   * Sends a POST request to log in a user and stores the auth token.
   * @param loginData User's login data (username, password).
   * @returns An Observable with the server's response, including the token.
   */
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login/`, loginData);
  }

  /**
   * Sends a POST request to log out a user by including their auth token in the headers.
   * @param token The user's authentication token.
   * @returns An Observable with the server's response.
   */
  logout(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.post(`${this.baseUrl}/auth/logout/`, null, { headers });
  }

  /**
   * Stores the authentication token in local storage.
   * @param token The authentication token received from the server.
   */
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Retrieves the authentication token from local storage.
   * @returns The stored token or null if no token is found.
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Removes the authentication token from local storage.
   */
  removeToken(): void {
    localStorage.removeItem('auth_token');
  }
}