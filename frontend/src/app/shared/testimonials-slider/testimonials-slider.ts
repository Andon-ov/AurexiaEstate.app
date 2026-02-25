import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { Subject, takeUntil } from 'rxjs';

import { TestimonialCard } from '../../core/models/testimonials-slider-card.model';
import { TestimonialService } from '../../core/services/testimonial.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-testimonials-slider',
  standalone: false,
  templateUrl: './testimonials-slider.html',
  styleUrl: './testimonials-slider.css',
})
export class TestimonialsSlider implements OnInit, AfterViewInit, OnDestroy {
  private testimonialService = inject(TestimonialService);
  private i18n = inject(I18nService);
  private destroy$ = new Subject<void>();
  
  cards: TestimonialCard[] = [];
  isLoading = false; // Start false - only show skeleton if data takes time
  currentLang!: string;
  private swiper?: Swiper;

  ngOnInit(): void {
    this.currentLang = this.i18n.getCurrentLanguage();
    this.loadTestimonials(this.currentLang);

    // Subscribe to language changes
    this.i18n.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        if (lang !== this.currentLang) {
          this.currentLang = lang;
          this.loadTestimonials(lang);
        }
      });
  }

  ngAfterViewInit(): void {
    // Swiper will be initialized after data loads
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  private loadTestimonials(lang: string): void {
    // Smart loading: show skeleton only if request takes more than 100ms
    const loadingTimeout = setTimeout(() => {
      this.isLoading = true;
    }, 100);
    
    this.testimonialService.getTestimonials(lang)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          clearTimeout(loadingTimeout);
          this.cards = data;
          this.isLoading = false;
          
          // Initialize or update Swiper after data loads
          setTimeout(() => this.initializeSwiper(), 100);
        },
        error: (error) => {
          clearTimeout(loadingTimeout);
          console.error('Error loading testimonials:', error);
          this.isLoading = false;
        }
      });
  }

  private initializeSwiper(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }

    this.swiper = new Swiper('.card_CAU', {
      modules: [Navigation, Autoplay],
      rewind: true,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      centeredSlides: false,
      spaceBetween: 50,
      speed: 600,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        767: { slidesPerView: 2 },
        991: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  }
}
