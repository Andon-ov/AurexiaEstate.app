import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';
import { AboutUsImageService, AboutUsImageContent } from '../../../core/services/about-us-image.service';

@Component({
  selector: 'app-about-us-image',
  standalone: false,
  templateUrl: './about-us-image.html',
  styleUrl: './about-us-image.css'
})
export class AboutUsImage implements OnInit {
  currentLang!: string;
  purposeContent?: AboutUsImageContent;
  isLoading = false;

  constructor(
    public i18n: I18nService,
    private aboutUsImageService: AboutUsImageService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    this.loadPurposeContent(this.currentLang);

    // Subscribe to language changes
    this.i18n.currentLang$.subscribe((lang: string) => {
      if (lang && lang !== this.currentLang) {
        this.currentLang = lang;
        this.loadPurposeContent(lang);
      }
    });
  }

  /**
   * Load "Our Purpose" content with Smart Loading
   * Shows skeleton only if loading takes > 100ms
   */
  private loadPurposeContent(lang: string): void {
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);

    this.aboutUsImageService.getPurposeContent(lang).subscribe({
      next: (data) => {
        clearTimeout(loadingTimeout);
        this.purposeContent = data;
        this.isLoading = false;
      },
      error: (error) => {
        clearTimeout(loadingTimeout);
        console.error('Error loading purpose content:', error);
        this.isLoading = false;
      }
    });
  }
}
