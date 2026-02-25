import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../../../core/services/translation.service';
import { I18nService } from '../../../core/services/i18n.service';
import { CtaService, HomePageCTA } from '../../../core/services/cta.service';

@Component({
  selector: 'app-cta-white',
  standalone: false,
  templateUrl: './cta-white.html',
  styleUrl: './cta-white.css',
})
export class CtaWhite implements OnInit, OnDestroy {
  currentLang!: string;
  cta: HomePageCTA | null = null;
  private destroy$ = new Subject<void>();
  
  constructor(
    public translation: TranslationService, 
    public i18n: I18nService,
    private router: Router,
    private ctaService: CtaService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Load CTA data
    this.loadCTA();
    
    // Subscribe to language changes
    this.i18n.currentLang$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(lang => {
      this.currentLang = lang;
      this.loadCTA();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCTA() {
    this.ctaService.getHomePageCTA(this.currentLang).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.cta = data;
      },
      error: (error) => {
        console.error('Error loading home page CTA:', error);
      }
    });
  }

  navigateToContact() {
    if (this.cta?.buttonLink) {
      this.router.navigate([this.cta.buttonLink]);
    } else {
      this.router.navigate(['/contact']);
    }
  }
}

