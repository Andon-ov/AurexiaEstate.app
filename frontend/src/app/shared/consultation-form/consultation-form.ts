import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InquiryService } from '../../core/services/inquiry.service';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-consultation-form',
  standalone: false,
  templateUrl: './consultation-form.html',
  styleUrl: './consultation-form.css'
})
export class ConsultationForm implements OnInit {
  @Input() propertyId?: number;
  @Input() propertyTitle?: string;
  @Input() compact = false;

  form!: FormGroup;
  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private inquiryService: InquiryService,
    public translation: TranslationService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      budget_range: [''],
      preferred_contact_method: ['email']
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const inquiryData = {
      ...this.form.value,
      property: this.propertyId
    };

    this.inquiryService.submitInquiry(inquiryData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isSuccess = true;
        this.form.reset();
        setTimeout(() => { this.isSuccess = false; }, 5000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = this.translation.t('consultation.error');
      }
    });
  }
}
