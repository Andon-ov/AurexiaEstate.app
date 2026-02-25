import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class VerifyEmail implements OnInit {
  isLoading = true;
  isSuccess = false;
  errorMessage = '';
  token = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public translation: TranslationService
  ) {}

  async ngOnInit() {
    await this.translation.loadTranslations();
    
    // Get token from URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.token) {
      this.isLoading = false;
      this.errorMessage = this.translation.t('auth.verifyEmail.invalidToken');
      return;
    }
    
    // Verify the token
    this.authService.verifyEmail(this.token).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || this.translation.t('auth.verifyEmail.verificationFailed');
      }
    });
  }
  
  goToHome() {
    this.router.navigate(['/']);
  }
  
  resendEmail() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.isLoading = true;
    this.authService.resendVerificationEmail().subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = '';
        // Show success message
        alert(this.translation.t('auth.verifyEmail.emailResent'));
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || this.translation.t('auth.verifyEmail.resendFailed');
      }
    });
  }
}