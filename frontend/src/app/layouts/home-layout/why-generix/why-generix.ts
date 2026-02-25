import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../../../core/services/translation.service';
import { I18nService } from '../../../core/services/i18n.service';
import { WhyGenerixService, WhyGenerixSection } from '../../../core/services/why-generix.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-why-generix',
  standalone: false,
  templateUrl: './why-generix.html',
  styleUrl: './why-generix.css',
})
export class WhyGenerix implements OnInit, OnDestroy {
  currentLang!: string;
  section?: WhyGenerixSection;
  isLoading = false; // Start false - only show skeleton if data takes time
  private langSubscription?: Subscription;

  constructor(
    public translation: TranslationService, 
    public i18n: I18nService,
    private whyGenerixService: WhyGenerixService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Load initial section data
    this.loadSection(this.currentLang);
    
    // Subscribe to language changes
    this.langSubscription = this.i18n.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.loadSection(lang);
    });
  }
  
  private loadSection(lang: string): void {
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    
    this.whyGenerixService.getSection(lang).subscribe({
      next: (section) => {
        clearTimeout(loadingTimeout);
        this.section = section;
        this.isLoading = false;
      },
      error: (error) => {
        clearTimeout(loadingTimeout);
        console.error('Error loading Why Generix section:', error);
        this.section = undefined;
        this.isLoading = false;
      }
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscription
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
