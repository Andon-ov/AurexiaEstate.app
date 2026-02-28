import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-service-model',
  standalone: false,
  templateUrl: './service-model.html',
  styleUrl: './service-model.css'
})
export class ServiceModelComponent implements OnInit, OnDestroy {
  currentLang!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private seoService: SeoService,
    public i18n: I18nService,
    public translation: TranslationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    this.updateSEO();

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

  private updateSEO(): void {
    const lang = this.currentLang;
    this.seoService.updateSEOTags({
      title: lang === 'bg' ? 'Модел на обслужване – Aurexia Estate' : 'Service Model – Aurexia Estate',
      description: lang === 'bg'
        ? 'Мостът на Aurexia – нашата уникална консултантска методология за луксозни имоти.'
        : 'The Aurexia Bridge – our distinctive consultancy methodology for luxury real estate investments.',
      canonical: 'https://aurexiaestate.com/service-model'
    });
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: lang === 'bg' ? 'Модел на обслужване' : 'Service Model', url: '/service-model' }
    ]);
  }
}
