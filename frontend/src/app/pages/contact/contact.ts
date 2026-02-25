import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';
import { ContactService, ContactPageContent } from '../../services/contact.service';
import { SeoService } from '../../core/services/seo.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  currentLang!: string;
  contactContent?: ContactPageContent;
  isLoading = false; // Start with false - only show skeleton if data takes time

  constructor(
    public translation: TranslationService,
    public i18n: I18nService,
    private contactService: ContactService,
    private seoService: SeoService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    this.updateSEO();
    this.loadContactContent();

    // Subscribe to language changes
    this.i18n.currentLang$.subscribe((lang) => {
      if (this.currentLang !== lang) {
        this.currentLang = lang;
        this.updateSEO();
        this.loadContactContent();
      }
    });
  }

  private loadContactContent(): void {
    // Use a slight delay to show loading state only if data takes time
    // If data comes from cache (instant), loading will stay false
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100); // Show skeleton only if request takes more than 100ms
    
    this.contactService.getContactContent(this.currentLang).subscribe({
      next: (content) => {
        clearTimeout(loadingTimeout);
        this.contactContent = content;
        this.isLoading = false;
      },
      error: (error) => {
        clearTimeout(loadingTimeout);
        console.error('Error loading contact content:', error);
        this.isLoading = false;
      }
    });
  }

  private updateSEO(): void {
    const lang = this.currentLang;
    
    const seoData = {
      en: {
        title: 'Contact Generix | Get in Touch with Our Team',
        description: 'Contact Generix for insurance platform solutions. Get in touch with our team for inquiries, support, or to learn more about our self-service and corporate business platforms.',
        keywords: 'contact generix, insurance platform support, insurance software inquiries, contact us',
        ogTitle: 'Contact Generix - Insurance Platform Solutions',
        ogDescription: 'Get in touch with Generix team for insurance platform solutions and support',
        canonical: 'https://generix.app/contact'
      },
      bg: {
        title: 'Контакти Generix | Свържете се с нашия екип',
        description: 'Свържете се с Generix за платформени решения за застраховки. Свържете се с нашия екип за запитвания, поддръжка или за да научите повече за нашите платформи.',
        keywords: 'контакти generix, поддръжка застрахователна платформа, запитвания застрахователен софтуер, свържете се с нас',
        ogTitle: 'Контакти Generix - Платформени решения за застраховки',
        ogDescription: 'Свържете се с екипа на Generix за платформени решения за застраховки и поддръжка',
        canonical: 'https://generix.app/contact?lang=bg'
      }
    };

    const data = lang === 'bg' ? seoData.bg : seoData.en;
    
    this.seoService.updateSEOTags(data);
    this.seoService.setLanguageAlternates('/contact');
    
    // Add breadcrumb
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: lang === 'bg' ? 'Контакти' : 'Contact', url: '/contact' }
    ]);
  }
}
