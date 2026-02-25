import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';
import { I18nService } from '../../../core/services/i18n.service';
import { AuthService, RegistrationData } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css', './register-forms.css'],
})
export class Register implements OnInit {
  currentLang!: string;
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showPassword = false;
  acceptTerms = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public translation: TranslationService, 
    public i18n: I18nService
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      first_name: [''],
      last_name: [''],
      terms: [false, Validators.requiredTrue]
    });
  }

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // If already logged in, redirect to home
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const registrationData: RegistrationData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      first_name: this.registerForm.value.first_name,
      last_name: this.registerForm.value.last_name
    };
    
    this.authService.register(registrationData).subscribe({
      next: () => {
        this.isSubmitting = false;
        // After successful registration, log in the user
        this.authService.login(registrationData.username, registrationData.password).subscribe({
          next: () => {
            // Add a query param to indicate new registration for showing verification notice
            this.router.navigate(['/'], { queryParams: { newRegistration: 'true' } });
          },
          error: (error) => {
            console.error('Login after registration error:', error);
            // Just redirect to login page if auto-login fails
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Registration error:', error);
        
        if (error.error && typeof error.error === 'object') {
          // Check for email uniqueness error
          if (error.error.email && Array.isArray(error.error.email)) {
            const emailError = error.error.email.find((err: string) => 
              err.includes('already exists') || 
              err.includes('уникален') || 
              err.includes('съществува')
            );
            
            if (emailError) {
              this.errorMessage = this.translation.t('auth.register.emailExists') || 
                                'A user with this email already exists.';
              return;
            }
          }
          
          // Handle other field-specific errors
          const firstError = Object.keys(error.error)[0];
          if (firstError && Array.isArray(error.error[firstError])) {
            // Get the field name and translate it if possible
            let fieldName = firstError;
            try {
              // Try to get translated field name
              fieldName = this.translation.t(`auth.register.${firstError}Label`) || firstError;
            } catch (e) {
              // If translation not found, use the original field name but make it more readable
              fieldName = fieldName.replace('_', ' ');
              // Capitalize first letter
              fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            }
            
            this.errorMessage = `${fieldName}: ${error.error[firstError][0]}`;
          } else {
            this.errorMessage = this.translation.t('auth.register.registrationError');
          }
        } else {
          this.errorMessage = this.translation.t('auth.register.serverError');
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    console.log('Toggle password visibility:', this.showPassword);
  }
}
