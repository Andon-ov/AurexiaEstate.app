import { Component, OnInit, OnDestroy } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { CaseStudySlide } from '../../core/models/case-study-slide.model';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';
import { WhyGenerixService } from '../../core/services/why-generix.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-case-studies-slider',
  standalone: false,
  templateUrl: './case-studies-slider.html',
  styleUrl: './case-studies-slider.css',
})
export class CaseStudiesSlider implements AfterViewInit, OnInit, OnDestroy {
  slides: CaseStudySlide[] = [];
  isLoading = false; // Start false - only show skeleton if data takes time
  private swiper?: Swiper;
  private langSubscription?: Subscription;

  currentLang!: string;
  
  constructor(
    public translation: TranslationService, 
    public i18n: I18nService,
    private whyGenerixService: WhyGenerixService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Load initial slides
    this.loadSlides(this.currentLang);
    
    // Subscribe to language changes
    this.langSubscription = this.i18n.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.loadSlides(lang);
    });
  }

  private loadSlides(lang: string): void {
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    
    this.whyGenerixService.getCaseStudies(lang).subscribe({
      next: (slides) => {
        clearTimeout(loadingTimeout);
        this.slides = slides;
        this.isLoading = false;
        
        // Initialize or update Swiper after data loads
        if (!this.swiper) {
          setTimeout(() => this.initSwiper(), 100);
        } else {
          setTimeout(() => {
            this.swiper?.update();
          }, 100);
        }
      },
      error: (error) => {
        clearTimeout(loadingTimeout);
        console.error('Error loading case study slides:', error);
        this.slides = [];
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Wait for data to load before initializing Swiper
    // initSwiper will be called from loadSlides() after data arrives
  }
  
  private initSwiper(): void {
    if (this.slides.length === 0) return;
    
    // Only enable loop if we have enough slides (minimum 3 for smooth looping)
    const enableLoop = this.slides.length >= 3;
    
    this.swiper = new Swiper('.case-studies-swiper', {
      modules: [Autoplay, EffectFade],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: enableLoop,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      roundLengths: true,
      grabCursor: true,
      updateOnWindowResize: true
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscription
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    
    // Destroy Swiper instance
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}
