import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeroSlider } from './hero-slider/hero-slider';
import { PlatformCard } from './platform-card/platform-card';
import { LanguageSwitcher } from './language-switcher/language-switcher';
import { ContactForm } from './contact-form/contact-form';
import { TestimonialsSlider } from './testimonials-slider/testimonials-slider';
import { CaseStudiesSlider } from './case-studies-slider/case-studies-slider';
import { AnimateOnScrollDirective } from './directives/animate-on-scroll.directive';
import { PlatformFeaturesComponent } from './platform-features/platform-features';
import { Cta } from './cta/cta';
import { PropertyCard } from './property-card/property-card';
import { DestinationCard } from './destination-card/destination-card';
import { ConsultationForm } from './consultation-form/consultation-form';

@NgModule({
  declarations: [
    HeroSlider,
    PlatformCard,
    LanguageSwitcher,
    ContactForm,
    TestimonialsSlider,
    CaseStudiesSlider,
    PlatformFeaturesComponent,
    Cta,
    PropertyCard,
    DestinationCard,
    ConsultationForm,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AnimateOnScrollDirective,
  ],
  exports: [
    HeroSlider,
    PlatformCard,
    LanguageSwitcher,
    ContactForm,
    TestimonialsSlider,
    CaseStudiesSlider,
    AnimateOnScrollDirective,
    PlatformFeaturesComponent,
    Cta,
    PropertyCard,
    DestinationCard,
    ConsultationForm,
  ],
})
export class SharedModule {}
