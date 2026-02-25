import { Component, OnInit, OnDestroy } from '@angular/core';
import { Achievement } from '../../../core/models/achievement.model';
import { Partner, PARTNERS_OLD } from '../../../core/models/partner.model';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslationService } from '../../../core/services/translation.service';
import { CustomersService, CustomersSection } from '../../../core/services/customers.service';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit, OnDestroy {
  section: CustomersSection = { 
    title: 'Our Customers', 
    subtitle: 'Loading...' 
  };
  achievements: Achievement[] = [];
  partners: Partner[] = [...PARTNERS_OLD, ...PARTNERS_OLD];
  currentLang!: string;
  isLoadingAchievements = false;
  private langSubscription?: Subscription;

  constructor(
    public translation: TranslationService,
    public i18n: I18nService,
    private customersService: CustomersService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();

    // Load initial data
    this.loadCustomersData(this.currentLang);

    // Subscribe to language changes
    this.langSubscription = this.i18n.currentLang$.subscribe((lang) => {
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.loadCustomersData(lang);
      }
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private loadCustomersData(lang: string): void {
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoadingAchievements = true;
    }, 100);

    // Load section, achievements, and partners in parallel
    forkJoin({
      section: this.customersService.getSection(lang),
      achievements: this.customersService.getAchievements(lang),
      partners: this.customersService.getPartners()
    }).subscribe({
      next: (data) => {
        clearTimeout(loadingTimeout);
        this.section = data.section;
        this.achievements = data.achievements;
        this.isLoadingAchievements = false;
        // Duplicate partners for seamless carousel loop
        this.partners = [...data.partners, ...data.partners];
      },
      error: (error) => {
        clearTimeout(loadingTimeout);
        console.error('Error loading customers data:', error);
        this.achievements = [];
        this.isLoadingAchievements = false;
      }
    });
  }
}
