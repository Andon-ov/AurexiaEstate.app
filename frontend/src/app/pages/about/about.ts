import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';
import { AboutUsService, AboutPageHero, AboutPageAchievementsHeader } from '../../core/services/about-us.service';
import { Achievement } from '../../core/models/achievement.model';
import { CustomersService } from '../../core/services/customers.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit, OnDestroy {
  currentLang!: string;
  achievements: Achievement[] = [];
  aboutHero: AboutPageHero | null = null;
  achievementsHeader?: AboutPageAchievementsHeader;
  isLoading = false; // Start false - only show skeleton if data takes time
  isLoadingAchievements = false; // Separate loading state for achievements section
  private destroy$ = new Subject<void>();

  constructor(
    public translation: TranslationService, 
    public i18n: I18nService,
    private aboutUsService: AboutUsService,
    private customersService: CustomersService,
    private seoService: SeoService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Update SEO
    this.updateSEO();
    
    // Load About Page Hero from API
    this.loadAboutPageHero();
    
    // Load Achievements Header and Data from API
    this.loadAchievementsHeader();
    this.loadAchievements();

    // Subscribe to language changes
    this.i18n.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLang = lang;
        this.updateSEO();
        this.loadAboutPageHero();
        this.loadAchievementsHeader();
        this.loadAchievements();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAboutPageHero() {
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    
    this.aboutUsService.getAboutPageHero(this.currentLang)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          clearTimeout(loadingTimeout);
          this.aboutHero = data;
          this.isLoading = false;
        },
        error: (error) => {
          clearTimeout(loadingTimeout);
          console.error('Error loading about page hero:', error);
          this.aboutHero = null;
          this.isLoading = false;
        }
      });
  }

  private loadAchievementsHeader() {
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoadingAchievements = true;
    }, 100);
    
    this.aboutUsService.getAchievementsHeader(this.currentLang)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          clearTimeout(loadingTimeout);
          this.achievementsHeader = data;
          this.isLoadingAchievements = false;
        },
        error: (error) => {
          clearTimeout(loadingTimeout);
          console.error('Error loading achievements header:', error);
          this.isLoadingAchievements = false;
        }
      });
  }

  private loadAchievements() {
    this.customersService.getAchievements(this.currentLang)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.achievements = data;
        },
        error: (error) => {
          console.error('Error loading achievements:', error);
          this.achievements = [];
        }
      });
  }

  private updateSEO(): void {
    const lang = this.currentLang;
    
    const seoData = {
      en: {
        title: 'About Generix | Our Mission, Vision & Achievements',
        description: 'Discover Generix mission to drive success through technology and innovation. Learn about our achievements, expertise in insurance platform solutions, and how we help businesses automate workflows and deliver seamless digital experiences.',
        keywords: 'about generix, insurance platform, insurance software company, digital insurance solutions, insurance technology, our mission, company achievements, innovation',
        ogTitle: 'About Generix - Our Mission, Vision & Achievements',
        ogDescription: 'Discover Generix mission, vision and achievements in insurance platform solutions',
        canonical: 'https://generix.app/about'
      },
      bg: {
        title: 'За Generix | Нашата мисия, визия и постижения',
        description: 'Открийте мисията на Generix да стимулира успеха чрез технологии и иновации. Научете повече за нашите постижения, експертиза в платформени решения за застраховки и как помагаме на бизнеса да автоматизира процесите.',
        keywords: 'за generix, застрахователна платформа, компания за застрахователен софтуер, дигитални застрахователни решения, наша мисия, постижения, иновации',
        ogTitle: 'За Generix - Нашата мисия, визия и постижения',
        ogDescription: 'Открийте мисията, визията и постиженията на Generix в застрахователните решения',
        canonical: 'https://generix.app/about?lang=bg'
      }
    };

    const data = lang === 'bg' ? seoData.bg : seoData.en;
    
    this.seoService.updateSEOTags(data);
    this.seoService.setLanguageAlternates('/about');
    
    // Add breadcrumb
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: lang === 'bg' ? 'За нас' : 'About', url: '/about' }
    ]);
  }
}
