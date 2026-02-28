import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';
import { PropertyService } from '../../core/services/property.service';
import { PropertyDetail as PropertyDetailModel, PropertyImage } from '../../core/models/property.model';

@Component({
  selector: 'app-property-detail',
  standalone: false,
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css'
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  property: PropertyDetailModel | null = null;
  isLoading = true;
  currentLang!: string;
  selectedImageIndex = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private seoService: SeoService,
    public i18n: I18nService,
    public translation: TranslationService,
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
          return this.propertyService.getPropertyBySlug(params['slug']);
        })
      )
      .subscribe({
        next: (property) => {
          this.property = property;
          this.isLoading = false;
          this.updateSEO();
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

  get title(): string {
    if (!this.property) return '';
    return this.currentLang === 'bg' ? this.property.title_bg : this.property.title_en;
  }

  get description(): string {
    if (!this.property) return '';
    return this.currentLang === 'bg' ? this.property.description_bg : this.property.description_en;
  }

  get destinationName(): string {
    if (!this.property) return '';
    return this.currentLang === 'bg' ? this.property.destination.name_bg : this.property.destination.name_en;
  }

  get allImages(): { src: string; alt: string }[] {
    if (!this.property) return [];
    const images: { src: string; alt: string }[] = [];

    if (this.property.featured_image) {
      images.push({ src: this.property.featured_image, alt: this.title });
    }

    if (this.property.images) {
      this.property.images.forEach(img => {
        const caption = this.currentLang === 'bg' ? img.caption_bg : img.caption_en;
        images.push({ src: img.image, alt: caption || this.title });
      });
    }

    return images;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getFeatureName(feature: any): string {
    return this.currentLang === 'bg' ? feature.name_bg : feature.name_en;
  }

  getPropertyTypeLabel(): string {
    if (!this.property) return '';
    const types: Record<string, Record<string, string>> = {
      villa: { en: 'Contemporary Villa', bg: 'Вила' },
      penthouse: { en: 'Penthouse', bg: 'Пентхаус' },
      mansion: { en: 'Mansion', bg: 'Имение' },
      apartment: { en: 'Luxury Apartment', bg: 'Луксозен апартамент' },
      estate: { en: 'Estate', bg: 'Имение' },
      chalet: { en: 'Chalet', bg: 'Шале' }
    };
    const type = types[this.property.property_type];
    return type ? type[this.currentLang] || type['en'] : this.property.property_type;
  }

  private updateSEO(): void {
    if (!this.property) return;
    const title = this.title;
    this.seoService.updateSEOTags({
      title: `${title} - Aurexia Estate`,
      description: this.property.meta_description_en || this.property.short_description_en,
      ogImage: this.property.featured_image,
      canonical: `https://aurexiaestate.com/property/${this.property.slug}`
    });
    const lang = this.currentLang;
    this.seoService.setLanguageAlternates(`/property/${this.property.slug}`);
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: lang === 'bg' ? 'Портфолио' : 'Portfolio', url: '/portfolio' },
      { name: title, url: `/property/${this.property.slug}` }
    ]);
  }
}
