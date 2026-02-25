import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { HeroSlide, HERO_SLIDES_OLD } from '../../core/models/hero-slide.model';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';
import { HeroSlideService } from '../../core/services/hero-slide.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero-slider',
  standalone: false,
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css',
})
export class HeroSlider implements OnInit, AfterViewInit, OnDestroy {
  slides: HeroSlide[] = [];
  currentLang!: string;
  isLoading = false; // Start false - only show skeleton if data takes time
  private swiper?: Swiper;
  private langSubscription?: Subscription;

  constructor(
    public translation: TranslationService, 
    public i18n: I18nService,
    private heroSlideService: HeroSlideService
  ) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
    
    // Load hero slides initially
    this.loadHeroSlides(this.currentLang);

    // Subscribe to language changes
    this.langSubscription = this.i18n.currentLang$.subscribe((lang) => {
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.loadHeroSlides(lang);
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize Swiper with fallback slides
    setTimeout(() => {
      this.initSwiper();
    }, 100);
  }

  ngOnDestroy() {
    // Cleanup
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  private loadHeroSlides(lang: string): void {
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    
    this.heroSlideService.getHeroSlides(lang).subscribe({
      next: (slides) => {
        clearTimeout(loadingTimeout);
        this.slides = slides;
        this.isLoading = false;
        
        // Destroy existing swiper if it exists
        if (this.swiper) {
          this.swiper.destroy(true, true);
          this.swiper = undefined;
        }
        
        // Initialize Swiper after slides are loaded and DOM is updated
        setTimeout(() => {
          this.initSwiper();
        }, 100);
      },
      error: (error) => {
        clearTimeout(loadingTimeout);
        console.error('Error loading hero slides:', error);
        this.slides = [];
        this.isLoading = false;
      }
    });
  }

  private initSwiper(): void {
    const swiperElement = document.querySelector('.hero-slider');
    if (!swiperElement) {
      console.error('Swiper element not found');
      return;
    }

    this.swiper = new Swiper('.hero-slider', {
      modules: [Autoplay, Pagination, EffectFade],
      loop: this.slides.length > 1, // Only loop if more than 1 slide
      autoplay: this.slides.length > 1 ? {
        delay: 4000,
        disableOnInteraction: false,
      } : false,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
}
