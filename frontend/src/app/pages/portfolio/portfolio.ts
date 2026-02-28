import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';
import { PropertyService } from '../../core/services/property.service';
import { PropertyListItem } from '../../core/models/property.model';

@Component({
  selector: 'app-portfolio',
  standalone: false,
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class Portfolio implements OnInit, OnDestroy {
  properties: PropertyListItem[] = [];
  isLoading = false;
  currentLang!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private seoService: SeoService,
    public i18n: I18nService,
    public translation: TranslationService,
    private propertyService: PropertyService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    this.updateSEO();
    this.loadProperties();

    this.i18n.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLang = lang;
        this.updateSEO();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getProperties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (properties) => {
          this.properties = properties;
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
  }

  private updateSEO(): void {
    const lang = this.i18n.getCurrentLanguage();
    const seoData = {
      en: {
        title: 'Curated Portfolio - Aurexia Estate',
        description: 'An exclusive collection of the world\'s most exceptional properties. Each residence has been personally vetted by our team.',
        keywords: 'luxury portfolio, premium villas, penthouses, estates, investment properties',
        canonical: 'https://aurexiaestate.com/portfolio'
      },
      bg: {
        title: 'Портфолио - Aurexia Estate',
        description: 'Ексклузивна колекция от най-изключителните имоти в света. Всеки имот е лично проверен от нашия екип.',
        keywords: 'луксозно портфолио, премиум вили, пентхауси, имения, инвестиционни имоти',
        canonical: 'https://aurexiaestate.com/portfolio?lang=bg'
      }
    };
    const data = lang === 'bg' ? seoData.bg : seoData.en;
    this.seoService.updateSEOTags(data);
    this.seoService.setLanguageAlternates('/portfolio');
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: lang === 'bg' ? 'Портфолио' : 'Portfolio', url: '/portfolio' }
    ]);
  }
}
