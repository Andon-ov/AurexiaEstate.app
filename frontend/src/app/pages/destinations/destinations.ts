import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';
import { DestinationService } from '../../core/services/destination.service';
import { Destination } from '../../core/models/destination.model';

@Component({
  selector: 'app-destinations',
  standalone: false,
  templateUrl: './destinations.html',
  styleUrl: './destinations.css'
})
export class Destinations implements OnInit, OnDestroy {
  destinations: Destination[] = [];
  isLoading = false;
  currentLang!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private seoService: SeoService,
    public i18n: I18nService,
    public translation: TranslationService,
    private destinationService: DestinationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    this.updateSEO();
    this.loadDestinations();

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

  getName(destination: Destination): string {
    return this.currentLang === 'bg' ? destination.name_bg : destination.name_en;
  }

  getDescription(destination: Destination): string {
    return this.currentLang === 'bg' ? destination.description_bg : destination.description_en;
  }

  private loadDestinations(): void {
    this.isLoading = true;
    this.destinationService.getDestinations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (destinations) => {
          this.destinations = destinations;
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
  }

  private updateSEO(): void {
    const lang = this.i18n.getCurrentLanguage();
    const seoData = {
      en: {
        title: 'Our Destinations - Aurexia Estate',
        description: 'Explore the world\'s most prestigious locations for luxury real estate investment. Spain, Dubai, Switzerland, and more.',
        keywords: 'luxury destinations, Spain real estate, Dubai property, Switzerland villas',
        canonical: 'https://aurexiaestate.com/destinations'
      },
      bg: {
        title: 'Дестинации - Aurexia Estate',
        description: 'Разгледайте най-престижните локации в света за инвестиции в луксозни имоти. Испания, Дубай, Швейцария и други.',
        keywords: 'луксозни дестинации, имоти Испания, имоти Дубай, вили Швейцария',
        canonical: 'https://aurexiaestate.com/destinations?lang=bg'
      }
    };
    const data = lang === 'bg' ? seoData.bg : seoData.en;
    this.seoService.updateSEOTags(data);
    this.seoService.setLanguageAlternates('/destinations');
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: lang === 'bg' ? 'Дестинации' : 'Destinations', url: '/destinations' }
    ]);
  }
}
