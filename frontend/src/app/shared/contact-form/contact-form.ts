import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';
import { AuthService, User } from '../../core/services/auth.service';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact-form',
  standalone: false,
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm implements OnInit {
  currentLang!: string;
  isLoaded = false; // For controlling animation after loading
  contactForm!: FormGroup;
  currentUser: User | null = null;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  
  constructor(
    public translation: TranslationService, 
    public i18n: I18nService,
    private fb: FormBuilder,
    private authService: AuthService,
    private contactService: ContactService
  ) {
    this.createForm();
  }

  createForm() {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s-]{6,20}$')]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // A little delay for a smoother animation effect
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);

    // Check if user is logged in and populate form
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.contactForm.patchValue({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          phone: user.profile?.phone_number || '',
          email: user.email || ''
        });
      }
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    // Get form data
    const formData = this.contactForm.value;
    
    // Enhanced logging for debugging
    console.log('Submitting form with data:', formData);
    
    // Send data to backend through service
    this.contactService.sendContactForm(formData).subscribe({
      next: (response) => {
        console.log('Received successful response:', response);
        this.isSubmitting = false;
        this.submitSuccess = true;
        
        // Reset the form after successful submission
        // But keep user data if they are logged in
        if (this.currentUser) {
          const userData = {
            firstName: this.currentUser.first_name || '',
            lastName: this.currentUser.last_name || '',
            phone: this.currentUser.profile?.phone_number || '',
            email: this.currentUser.email || ''
          };
          this.contactForm.reset(userData);
        } else {
          this.contactForm.reset();
        }
      },
      error: (error) => {
        console.error('Error submitting contact form:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.isSubmitting = false;
        this.submitError = true;
      }
    });
  }
}
