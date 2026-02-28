import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';
import { PropertyService } from '../../core/services/property.service';
import { DestinationService } from '../../core/services/destination.service';
import { PropertyListItem } from '../../core/models/property.model';
import { Destination } from '../../core/models/destination.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  featuredProperties: PropertyListItem[] = [];
  featuredDestinations: Destination[] = [];
  isLoadingProperties = false;
  isLoadingDestinations = false;
  currentLang!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private seoService: SeoService,
    public i18n: I18nService,
    public translation: TranslationService,
    private propertyService: PropertyService,
    private destinationService: DestinationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    this.updateSEO();
    this.loadFeaturedProperties();
    this.loadFeaturedDestinations();

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

  private loadFeaturedProperties(): void {
    this.isLoadingProperties = true;
    this.propertyService.getFeaturedProperties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (properties) => {
          this.featuredProperties = properties;
          this.isLoadingProperties = false;
        },
        error: () => { this.isLoadingProperties = false; }
      });
  }

  private loadFeaturedDestinations(): void {
    this.isLoadingDestinations = true;
    this.destinationService.getFeaturedDestinations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (destinations) => {
          this.featuredDestinations = destinations;
          this.isLoadingDestinations = false;
        },
        error: () => { this.isLoadingDestinations = false; }
      });
  }

  private updateSEO(): void {
    const lang = this.i18n.getCurrentLanguage();
    const seoData = {
      en: {
        title: 'Aurexia Estate - Your Exclusive Gateway to Global Real Estate Investments',
        description: 'We bridge the gap between discerning investors and world-class developers. Curated luxury properties in Spain, Dubai, Switzerland, Germany, and Slovenia.',
        keywords: 'luxury real estate, premium properties, real estate investment, villas, penthouses, Spain, Dubai, Switzerland',
        ogTitle: 'Aurexia Estate - Luxury Real Estate Investments',
        ogDescription: 'Your exclusive gateway to global real estate investments.',
        canonical: 'https://aurexiaestate.com/'
      },
      bg: {
        title: 'Aurexia Estate - Вашият ексклузивен портал към глобални инвестиции в недвижими имоти',
        description: 'Свързваме взискателни инвеститори с първокласни предприемачи. Луксозни имоти в Испания, Дубай, Швейцария, Германия и Словения.',
        keywords: 'луксозни имоти, премиум имоти, инвестиции в недвижими имоти, вили, пентхауси',
        ogTitle: 'Aurexia Estate - Луксозни инвестиции в недвижими имоти',
        ogDescription: 'Вашият ексклузивен портал към глобални инвестиции в недвижими имоти.',
        canonical: 'https://aurexiaestate.com/?lang=bg'
      }
    };
    const data = lang === 'bg' ? seoData.bg : seoData.en;
    this.seoService.updateSEOTags(data);
    this.seoService.setLanguageAlternates('/');
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' }
    ]);
  }
}
