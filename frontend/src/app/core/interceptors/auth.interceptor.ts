import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token
    const token = this.authService.tokenValue;

    // Clone the request and add the authorization header if token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${token}`
        }
      });
    }

    // Handle the request and catch any errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          // If not on the login page already, redirect to login
          if (!this.router.url.includes('/login')) {
            // Logout will clear the user data
            this.authService.logout();
            this.router.navigate(['/login'], { 
              queryParams: { returnUrl: this.router.url }
            });
          }
        }
        
        // Rethrow the error for other error handlers
        return throwError(() => error);
      })
    );
  }
}