import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';
import { DestinationService } from '../../core/services/destination.service';
import { PropertyService } from '../../core/services/property.service';
import { Destination } from '../../core/models/destination.model';
import { PropertyListItem } from '../../core/models/property.model';

@Component({
  selector: 'app-destination-detail',
  standalone: false,
  templateUrl: './destination-detail.html',
  styleUrl: './destination-detail.css'
})
export class DestinationDetail implements OnInit, OnDestroy {
  destination: Destination | null = null;
  properties: PropertyListItem[] = [];
  isLoading = true;
  isLoadingProperties = false;
  currentLang!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private seoService: SeoService,
    public i18n: I18nService,
    public translation: TranslationService,
    private destinationService: DestinationService,
    private propertyService: PropertyService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();

    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          this.isLoading = true;
          return this.destinationService.getDestinationBySlug(params['slug']);
        })
      )
      .subscribe({
        next: (destination) => {
          this.destination = destination;
          this.isLoading = false;
          this.updateSEO();
          this.loadProperties(destination.slug);
        },
        error: () => { this.isLoading = false; }
      });

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

  get name(): string {
    if (!this.destination) return '';
    return this.currentLang === 'bg' ? this.destination.name_bg : this.destination.name_en;
  }

  get description(): string {
    if (!this.destination) return '';
    return this.currentLang === 'bg' ? this.destination.description_bg : this.destination.description_en;
  }

  get shortDescription(): string {
    if (!this.destination) return '';
    return this.currentLang === 'bg' ? this.destination.short_description_bg : this.destination.short_description_en;
  }

  private loadProperties(slug: string): void {
    this.isLoadingProperties = true;
    this.propertyService.getPropertiesByDestination(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (properties) => {
          this.properties = properties;
          this.isLoadingProperties = false;
        },
        error: () => { this.isLoadingProperties = false; }
      });
  }

  private updateSEO(): void {
    if (!this.destination) return;
    const lang = this.i18n.getCurrentLanguage();
    const name = this.name;
    this.seoService.updateSEOTags({
      title: `${name} - Aurexia Estate`,
      description: this.destination.meta_description_en || this.shortDescription,
      canonical: `https://aurexiaestate.com/destinations/${this.destination.slug}`
    });
    this.seoService.setLanguageAlternates(`/destinations/${this.destination.slug}`);
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: lang === 'bg' ? 'Дестинации' : 'Destinations', url: '/destinations' },
      { name: name, url: `/destinations/${this.destination.slug}` }
    ]);
  }
}
