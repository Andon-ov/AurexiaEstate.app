import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-developer-partnership',
  standalone: false,
  templateUrl: './developer-partnership.html',
  styleUrl: './developer-partnership.css'
})
export class DeveloperPartnershipComponent implements OnInit, OnDestroy {
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
      title: lang === 'bg' ? 'Партньорство с девелопъри – Aurexia Estate' : 'Developer Partnership – Aurexia Estate',
      description: lang === 'bg'
        ? 'Партнирайте с Aurexia Estate за стратегическо позициониране и продажби на луксозни имоти.'
        : 'Partner with Aurexia Estate for strategic positioning and sales of luxury real estate developments.',
      canonical: 'https://aurexiaestate.com/developer-partnership'
    });
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/' },
      { name: lang === 'bg' ? 'За девелопъри' : 'For Developers', url: '/developer-partnership' }
    ]);
  }
}
