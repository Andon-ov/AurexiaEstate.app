import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  constructor(
    private seoService: SeoService,
    private i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.updateSEO();
    
    // Update SEO when language changes
    this.i18n.currentLang$.subscribe(() => {
      this.updateSEO();
    });
  }

  private updateSEO(): void {
    const lang = this.i18n.getCurrentLanguage();
    
    const seoData = {
      en: {
        title: 'Generix - Insurance Platform Solutions | Drive Success Through Innovation',
        description: 'Generix provides intelligent insurance platform solutions for self-service and corporate business. Our purpose: drive people\'s success through technology and innovation. Automate workflows, boost efficiency, and deliver seamless digital experiences.',
        keywords: 'insurance platform, self-service insurance, corporate insurance, insurance software, digital insurance, insurance automation, policy management, technology innovation, success through technology',
        ogTitle: 'Generix - Insurance Platform Solutions',
        ogDescription: 'Drive people\'s success through technology and innovation. Intelligent insurance platform solutions for self-service and corporate business.',
        canonical: 'https://generix.app/home'
      },
      bg: {
        title: 'Generix - Платформени решения за застраховки | Успех чрез иновации',
        description: 'Generix предоставя интелигентни платформени решения за застраховки за самообслужване и корпоративен бизнес. Нашата цел: стимулиране на успеха чрез технологии и иновации. Автоматизирайте процесите и предоставете безпроблемни дигитални изживявания.',
        keywords: 'застрахователна платформа, самообслужване застраховки, корпоративни застраховки, застрахователен софтуер, дигитални застраховки, автоматизация застраховки, технологични иновации, успех чрез технологии',
        ogTitle: 'Generix - Платформени решения за застраховки',
        ogDescription: 'Стимулиране на успеха чрез технологии и иновации. Интелигентни платформени решения за застраховки.',
        canonical: 'https://generix.app/home?lang=bg'
      }
    };

    const data = lang === 'bg' ? seoData.bg : seoData.en;
    
    this.seoService.updateSEOTags(data);
    this.seoService.setLanguageAlternates('/home');
    
    // Add breadcrumb
    this.seoService.addBreadcrumbStructuredData([
      { name: lang === 'bg' ? 'Начало' : 'Home', url: '/home' }
    ]);
  }
}
