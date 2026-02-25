import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';
import { CtaService, CallToAction } from '../../core/services/cta.service';

@Component({
  selector: 'app-cta',
  standalone: false,
  templateUrl: './cta.html',
  styleUrl: './cta.css'
})
export class Cta implements OnInit, OnDestroy {
  @Input() name: string = 'general'; // Default CTA name
  currentLang!: string;
  cta: CallToAction | null = null;
  isLoading = false; // Start false - only show skeleton if data takes time
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
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    
    this.ctaService.getCallToAction(this.name, this.currentLang).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        clearTimeout(loadingTimeout);
        this.cta = data;
        this.isLoading = false;
      },
      error: (error) => {
        clearTimeout(loadingTimeout);
        console.error(`Error loading CTA '${this.name}':`, error);
        this.cta = null;
        this.isLoading = false;
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

