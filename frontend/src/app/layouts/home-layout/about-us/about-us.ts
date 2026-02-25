import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../../../core/services/translation.service';
import { I18nService } from '../../../core/services/i18n.service';
import { AboutUsService, AboutUsTestimonial } from '../../../core/services/about-us.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs implements OnInit, OnDestroy {
  currentLang!: string;
  testimonial?: AboutUsTestimonial;
  isLoading = false; // Start false - only show skeleton if data takes time
  private langSubscription?: Subscription;

  constructor(
    public translation: TranslationService, 
    public i18n: I18nService,
    private aboutUsService: AboutUsService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Load initial testimonial data
    this.loadTestimonial(this.currentLang);
    
    // Subscribe to language changes
    this.langSubscription = this.i18n.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.loadTestimonial(lang);
    });
  }
  
  private loadTestimonial(lang: string): void {
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    
    this.aboutUsService.getTestimonial(lang).subscribe({
      next: (testimonial) => {
        clearTimeout(loadingTimeout);
        this.testimonial = testimonial;
        this.isLoading = false;
      },
      error: (error) => {
        clearTimeout(loadingTimeout);
        console.error('Error loading About Us testimonial:', error);
        this.testimonial = undefined;
        this.isLoading = false;
      }
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscription
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
