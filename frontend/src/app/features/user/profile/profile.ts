import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Profile implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  profileForm: FormGroup;
  currentLang!: string;
  isSubmitting = false;
  isResendingEmail = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  user: User | null = null;
  selectedFile: File | null = null;
  profileImagePreview: string | ArrayBuffer | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public translation: TranslationService,
    public i18n: I18nService
  ) {
    this.profileForm = this.formBuilder.group({
      first_name: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(30)
      ]],
      last_name: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(30)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      phone_number: ['', [
        Validators.pattern('^\\+?[0-9\\s-]{6,20}$')
      ]],
      company: ['', [
        Validators.maxLength(100)
      ]],
      position: ['', [
        Validators.maxLength(100)
      ]]
    });
  }

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Get user profile data
    this.authService.getProfile().subscribe({
      next: (user: User) => {
        this.user = user;
        
        this.profileForm.patchValue({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone_number: user.profile?.phone_number || '',
          company: user.profile?.company || '',
          position: user.profile?.position || ''
        });
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = this.translation.t('auth.profile.updateError');
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    // Use FormData for file uploads
    const formData = new FormData();
    
    // Add user data
    formData.append('first_name', this.profileForm.value.first_name);
    formData.append('last_name', this.profileForm.value.last_name);
    formData.append('email', this.profileForm.value.email);
    
    // Add profile data
    formData.append('phone_number', this.profileForm.value.phone_number || '');
    formData.append('company', this.profileForm.value.company || '');
    formData.append('position', this.profileForm.value.position || '');
    
    // Add profile image if selected
    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    this.authService.updateProfile(formData).subscribe({
      next: (user: User) => {
        this.isSubmitting = false;
        this.successMessage = this.translation.t('auth.profile.updateSuccess');
        this.user = user;
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Profile update error:', error);
        
        if (error.error && typeof error.error === 'object') {
          const firstError = Object.keys(error.error)[0];
          if (firstError && Array.isArray(error.error[firstError])) {
            this.errorMessage = `${firstError}: ${error.error[firstError][0]}`;
          } else {
            this.errorMessage = this.translation.t('auth.profile.updateError');
          }
        } else {
          this.errorMessage = this.translation.t('auth.profile.updateError');
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  
  // Resend verification email
  resendVerificationEmail() {
    if (!this.authService.isLoggedIn) {
      return;
    }
    
    this.isResendingEmail = true;
    this.authService.resendVerificationEmail().subscribe({
      next: (response) => {
        this.isResendingEmail = false;
        this.successMessage = this.translation.t('auth.profile.verificationEmailSent');
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      },
      error: (error) => {
        this.isResendingEmail = false;
        this.errorMessage = error.message || this.translation.t('auth.profile.verificationEmailFailed');
      }
    });
  }
}