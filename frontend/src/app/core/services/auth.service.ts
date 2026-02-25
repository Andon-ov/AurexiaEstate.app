import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile?: {
    phone_number?: string;
    company?: string;
    position?: string;
    profile_image?: string;
    profile_image_url?: string;
    is_email_verified: boolean;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  profile?: {
    phone_number?: string;
    company?: string;
    position?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  private tokenSubject: BehaviorSubject<string | null>;
  
  public currentUser$: Observable<User | null>;
  public token$: Observable<string | null>;

  constructor(private http: HttpClient) {
    // Initialize from localStorage if available
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getStoredUser()
    );
    this.tokenSubject = new BehaviorSubject<string | null>(
      localStorage.getItem('auth_token')
    );
    
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.token$ = this.tokenSubject.asObservable();
  }

  // Get current user value without subscribing
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Get token value without subscribing
  public get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  // Check if user is logged in
  public get isLoggedIn(): boolean {
    return !!this.tokenValue;
  }

  // Register new user
  register(registrationData: RegistrationData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register/`, registrationData).pipe(
      catchError(error => {
        // Return the full error object to allow better error handling
        return throwError(() => error);
      })
    );
  }

  // Login user
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, { username, password }).pipe(
      tap(response => {
        // Store user details and token in localStorage
        this.storeUserData(response);
      }),
      map(() => true),
      catchError(error => {
        return throwError(() => new Error(error.error?.detail || 'Login failed'));
      })
    );
  }

  // Logout user
  logout(): Observable<any> {
    // If no token, just clear local state
    if (!this.tokenValue) {
      this.clearUserData();
      return new Observable(subscriber => {
        subscriber.next(null);
        subscriber.complete();
      });
    }

    // Otherwise call logout API
    return this.http.post(`${this.apiUrl}/auth/logout/`, {}).pipe(
      tap(() => {
        this.clearUserData();
      }),
      catchError(error => {
        // Clear data even if API call fails
        this.clearUserData();
        return throwError(() => new Error(error.error?.detail || 'Logout failed'));
      })
    );
  }

  // Get user profile
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile/`).pipe(
      tap(user => {
        // Update stored user data
        this.updateUserData(user);
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.detail || 'Failed to fetch profile'));
      })
    );
  }

  // Update user profile
  updateProfile(profileData: any): Observable<User> {
    return this.http.put<{message: string, user: User}>(`${this.apiUrl}/auth/profile/update/`, profileData, {
      // Don't set Content-Type when sending FormData, the browser will set it with the correct boundary
      headers: profileData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.user),
      tap(user => {
        // Update stored user data
        this.updateUserData(user);
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.detail || 'Failed to update profile'));
      })
    );
  }

  // Change password
  changePassword(oldPassword: string, newPassword: string): Observable<{message: string, token: string}> {
    return this.http.post<{message: string, token: string}>(
      `${this.apiUrl}/auth/change-password/`,
      { old_password: oldPassword, new_password: newPassword }
    ).pipe(
      tap(response => {
        // Update token
        localStorage.setItem('auth_token', response.token);
        this.tokenSubject.next(response.token);
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.detail || 'Failed to change password'));
      })
    );
  }
  
  // Verify email with token
  verifyEmail(token: string): Observable<{success: boolean, message: string}> {
    return this.http.get<{success: boolean, message: string}>(
      `${this.apiUrl}/auth/verify-email/${token}/`
    ).pipe(
      tap(() => {
        // After successful verification, refresh the user profile
        if (this.isLoggedIn) {
          this.getProfile().subscribe();
        }
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Email verification failed'));
      })
    );
  }
  
  // Resend verification email
  resendVerificationEmail(): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(
      `${this.apiUrl}/auth/resend-verification-email/`, {}
    ).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Failed to resend verification email'));
      })
    );
  }

  // Private methods
  private getStoredUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  private storeUserData(response: AuthResponse): void {
    if (response.token && response.user) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      this.tokenSubject.next(response.token);
      this.currentUserSubject.next(response.user);
    }
  }

  private updateUserData(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearUserData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }
}