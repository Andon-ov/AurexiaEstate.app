import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';
import { I18nService } from '../../../core/services/i18n.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css', './login-forms.css'],
})
export class Login implements OnInit {
  currentLang!: string;
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public translation: TranslationService, 
    public i18n: I18nService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private returnUrl: string = '/';

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.router.url.includes('returnUrl=') 
      ? decodeURIComponent(this.router.url.split('returnUrl=')[1])
      : '/';
    
    // If already logged in, redirect
    if (this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const { username, password } = this.loginForm.value;
    
    this.authService.login(username, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.error && error.error.non_field_errors) {
          this.errorMessage = error.error.non_field_errors[0];
        } else if (error.error && typeof error.error === 'object') {
          const firstError = Object.keys(error.error)[0];
          if (firstError && Array.isArray(error.error[firstError])) {
            this.errorMessage = `${firstError}: ${error.error[firstError][0]}`;
          } else {
            this.errorMessage = this.translation.t('auth.login.invalidCredentials');
          }
        } else {
          this.errorMessage = this.translation.t('auth.login.loginError');
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    console.log('Toggle password visibility:', this.showPassword);
  }
}
