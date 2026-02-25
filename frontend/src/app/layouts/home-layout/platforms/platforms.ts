import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlatformCard } from '../../../core/models/platform-card.model';
import { TranslationService } from '../../../core/services/translation.service';
import { I18nService } from '../../../core/services/i18n.service';
import { PlatformService, PlatformsSectionHeader } from '../../../core/services/platform.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platforms',
  standalone: false,
  templateUrl: './platforms.html',
  styleUrl: './platforms.css',
})
export class Platforms implements OnInit, OnDestroy {
  cards: PlatformCard[] = [];
  header: PlatformsSectionHeader | null = null;
  currentLang!: string;
  isLoading = false; // Start false - only show skeleton if data takes time
  private headerLoaded = false;
  private cardsLoaded = false;
  private loadingTimeout?: ReturnType<typeof setTimeout>;
  private langSubscription?: Subscription;

  constructor(
    public translation: TranslationService, 
    public i18n: I18nService,
    private platformService: PlatformService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Load platform section header and cards initially
    this.loadPlatformsSectionHeader(this.currentLang);
    this.loadPlatformCards(this.currentLang);

    // Subscribe to language changes
    this.langSubscription = this.i18n.currentLang$.subscribe((lang) => {
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.loadPlatformsSectionHeader(lang);
        this.loadPlatformCards(lang);
      }
    });
  }

  ngOnDestroy() {
    // Cleanup subscription
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private loadPlatformsSectionHeader(lang: string): void {
    this.headerLoaded = false;
    this.startLoadingTimeout();
    
    this.platformService.getPlatformsSectionHeader(lang).subscribe({
      next: (header) => {
        this.header = header;
        this.headerLoaded = true;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading platforms section header:', error);
        this.header = null;
        this.headerLoaded = true;
        this.checkLoadingComplete();
      }
    });
  }

  private loadPlatformCards(lang: string): void {
    this.cardsLoaded = false;
    this.platformService.getPlatformCards(lang).subscribe({
      next: (cards) => {
        this.cards = cards;
        this.cardsLoaded = true;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading platform cards:', error);
        this.cards = [];
        this.cardsLoaded = true;
        this.checkLoadingComplete();
      }
    });
  }

  private startLoadingTimeout(): void {
    // Smart loading: show skeleton only if request takes more than 100ms
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    this.loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
  }

  private checkLoadingComplete(): void {
    // Both header and cards must be loaded (or failed)
    if (this.headerLoaded && this.cardsLoaded) {
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
      this.isLoading = false;
    }
  }
}
