import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { I18nService } from './i18n.service';
import { environment } from '../../../environments/environment';

/**
 * Интерфейс за резултатите от търсенето
 */
export interface SearchResult {
  title: string;
  description: string;
  category: string;
  link: string;
  priority: number;
}

/**
 * Service за търсене в цялото съдържание на сайта чрез API
 * Търси в: Hero Slides, Platform Cards, Features, About, Case Studies, 
 * Testimonials, CTAs, Contact page
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private i18n = inject(I18nService);
  private apiUrl = `${environment.apiUrl}/aurexia/`;
  
  /**
   * Извършва търсене в данните на приложението чрез API
   * 
   * @param query Ключовата дума/фраза за търсене
   * @returns Observable с резултатите от търсенето, сортирани по приоритет
   */
  search(query: string): Observable<SearchResult[]> {
    // Празна заявка връща празни резултати
    if (!query || query.trim() === '') {
      return of([]);
    }
    
    const lang = this.i18n.getCurrentLanguage();
    
    return this.http.get<SearchResult[]>(this.apiUrl, {
      params: {
        query: query.trim(),
        lang: lang
      }
    }).pipe(
      map(results => results || []),
      catchError(error => {
        console.error('Search error:', error);
        return of([]);
      })
    );
  }
  
  /**
   * Връща категорийната икона за даден резултат
   * @param category Категорията на резултата
   * @returns CSS клас за иконата
   */
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'hero': 'fas fa-star',
      'platform': 'fas fa-th-large',
      'feature': 'fas fa-puzzle-piece',
      'section': 'fas fa-bars',
      'about': 'fas fa-info-circle',
      'case_study': 'fas fa-briefcase',
      'testimonial': 'fas fa-quote-left',
      'cta': 'fas fa-bullhorn',
      'contact': 'fas fa-envelope'
    };
    
    return icons[category] || 'fas fa-file-alt';
  }
  
  /**
   * Връща човешки разбираемото име на категорията
   * @param category Категорията на резултата
   * @param lang Език (en|bg)
   * @returns Локализирано име на категорията
   */
  getCategoryName(category: string, lang: string = 'en'): string {
    const names: { [key: string]: { en: string, bg: string } } = {
      'hero': { en: 'Hero Section', bg: 'Главна секция' },
      'platform': { en: 'Platform', bg: 'Платформа' },
      'feature': { en: 'Feature', bg: 'Функционалност' },
      'section': { en: 'Section', bg: 'Секция' },
      'about': { en: 'About', bg: 'За нас' },
      'case_study': { en: 'Case Study', bg: 'Казус' },
      'testimonial': { en: 'Testimonial', bg: 'Отзив' },
      'cta': { en: 'Call to Action', bg: 'Призив за действие' },
      'contact': { en: 'Contact', bg: 'Контакт' }
    };
    
    const categoryData = names[category];
    if (categoryData) {
      return lang === 'bg' ? categoryData.bg : categoryData.en;
    }
    
    return category;
  }
}
