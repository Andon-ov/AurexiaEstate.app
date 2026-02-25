import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';
import { PlatformService } from '../../core/services/platform.service';
import { PlatformFeature } from '../../core/models/platform-feature.model';
import { SeoService } from '../../core/services/seo.service';

interface PlatformPageData {
  type: string;
  slug: string;
  heroTitle: string;
  title: string;
  subtitle: string;
  features: PlatformFeature[];
  readMoreText: string;
  containerClass: string;
  heroClass: string;
  bgImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

@Component({
  selector: 'app-platform-page',
  templateUrl: './platform-page.component.html',
  styleUrls: ['./platform-page.component.css'],
  standalone: false,
})
export class PlatformPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroTitle') heroTitle?: ElementRef<HTMLHeadingElement>;
  @ViewChild('heroSection') heroSection?: ElementRef<HTMLElement>;
  
  pageData?: PlatformPageData;
  currentLang!: string;
  overlayRightPosition: string = '50%';
  private destroy$ = new Subject<void>();

  constructor(
    public translation: TranslationService,
    public i18n: I18nService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private platformService: PlatformService,
    private seoService: SeoService
  ) {}

  async ngOnInit() {
    // Initialize current language
    this.currentLang = this.i18n.getCurrentLanguage();
    // Load translations
    await this.translation.loadTranslations();

    // Watch for route parameter changes (platform type)
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const platformType = params.get('type') || 'self-service';
      
      // Initialize page data structure
      this.initializePageData(platformType);
      
      // Load features from API
      this.loadPlatformFeatures();
      
      // Configure SEO metadata
      this.updateMetaTags();
    });

    // Watch for language changes
    this.i18n.currentLang$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(lang => {
      this.currentLang = lang;
      this.updateMetaTags();
      this.loadPlatformFeatures();
      // Recalculate overlay after language change
      setTimeout(() => this.calculateOverlayWidth(), 150);
    });
  }

  ngAfterViewInit(): void {
    // Calculate overlay width after view is initialized
    setTimeout(() => this.calculateOverlayWidth(), 100);
  }

  private calculateOverlayWidth(): void {
    if (!this.heroTitle?.nativeElement || !this.heroSection?.nativeElement) {
      return;
    }

    const titleElement = this.heroTitle.nativeElement;
    const sectionElement = this.heroSection.nativeElement;
    
    // Get measurements
    const titleWidth = titleElement.offsetWidth;
    const titleLeft = titleElement.offsetLeft;
    const sectionWidth = sectionElement.offsetWidth;
    
    // Calculate right position: 100% - ((titleLeft + titleWidth + padding) / sectionWidth * 100%)
    // Add 80px extra padding for visual effect
    const overlayEndPosition = titleLeft + titleWidth + 80;
    const rightPercent = ((sectionWidth - overlayEndPosition) / sectionWidth) * 100;
    
    // Ensure minimum and maximum values
    const finalRight = Math.max(15, Math.min(rightPercent, 60));
    
    this.overlayRightPosition = `${finalRight}%`;
  }

  private initializePageData(type: string): void {
    // Map platform type to slug
    const slug = type === 'corporate-business' ? 'corporate-business' : 'self-service';
    
    const pageDataConfig: Record<string, Partial<PlatformPageData>> = {
      'self-service': {
        type: 'self-service',
        slug: 'self-service',
        heroTitle: '', // Will be loaded from API
        title: '', // Will be loaded from API
        subtitle: '', // Will be loaded from API
        readMoreText: this.translation.t('features.readMore'),
        containerClass: 'self-service-container',
        heroClass: 'self-service-hero',
        bgImageUrl: 'https://www.scalefocus.com/wp-content/uploads/2025/02/SF_Website_Headers01-3.webp',
        metaTitle: 'platforms.meta.selfServiceTitle',
        metaDescription: 'platforms.meta.selfServiceDescription'
      },
      'corporate-business': {
        type: 'corporate-business',
        slug: 'corporate-business',
        heroTitle: '', // Will be loaded from API
        title: '', // Will be loaded from API
        subtitle: '', // Will be loaded from API
        readMoreText: this.translation.t('features.readMore'),
        containerClass: 'corporate-business-container',
        heroClass: 'corporate-business-hero',
        bgImageUrl: 'https://www.scalefocus.com/wp-content/uploads/2025/02/SF_Website_Headers01-3.webp',
        metaTitle: 'platforms.meta.corporateBusinessTitle',
        metaDescription: 'platforms.meta.corporateBusinessDescription'
      }
    };

    this.pageData = {
      ...pageDataConfig[type],
      features: [] // Will be loaded from API
    } as PlatformPageData;
  }

  private loadPlatformFeatures(): void {
    if (!this.pageData) return;

    this.platformService.getPlatformFeatures(this.pageData.slug, this.currentLang).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (this.pageData) {
          this.pageData.features = response.features;
          
          // Update hero title, title, and subtitle from API
          if (response.platform.heroTitle) {
            this.pageData.heroTitle = response.platform.heroTitle;
          }
          if (response.platform.title) {
            this.pageData.title = response.platform.title;
          }
          if (response.platform.subtitle) {
            this.pageData.subtitle = response.platform.subtitle;
          }
          
          // Recalculate overlay after title is loaded
          setTimeout(() => this.calculateOverlayWidth(), 150);
        }
      },
      error: (error) => {
        console.error(`Error loading features for ${this.pageData?.slug}:`, error);
      }
    });
  }

  /**
   * Updates metadata according to the current language
   */
  private updateMetaTags(): void {
    if (!this.pageData) {
      return;
    }

    if (this.pageData.metaTitle) {
      // Check if metaTitle starts with a translation key (e.g., "platforms.meta.")
      if (this.pageData.metaTitle.includes('.')) {
        this.titleService.setTitle(this.translation.t(this.pageData.metaTitle));
      } else {
        this.titleService.setTitle(this.pageData.metaTitle);
      }
    }

    if (this.pageData.metaDescription) {
      // Check if metaDescription starts with a translation key
      if (this.pageData.metaDescription.includes('.')) {
        this.metaService.updateTag({
          name: 'description',
          content: this.translation.t(this.pageData.metaDescription),
        });
      } else {
        this.metaService.updateTag({
          name: 'description',
          content: this.pageData.metaDescription,
        });
      }
    }

    // Add breadcrumb structured data
    const platformName = this.pageData.type === 'self-service' 
      ? (this.currentLang === 'bg' ? 'Самообслужване' : 'Self-Service')
      : (this.currentLang === 'bg' ? 'Корпоративен бизнес' : 'Corporate Business');
    
    this.seoService.addBreadcrumbStructuredData([
      { name: this.currentLang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: this.currentLang === 'bg' ? 'Платформи' : 'Platforms', url: '/platforms' },
      { name: platformName, url: `/platforms/${this.pageData.type}` }
    ]);

    // Set language alternates
    this.seoService.setLanguageAlternates(`/platforms/${this.pageData.type}`);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
