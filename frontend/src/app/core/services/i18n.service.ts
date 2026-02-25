// core/services/i18n.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private currentLang = new BehaviorSubject<string>('bg');
  public currentLang$ = this.currentLang.asObservable();

  constructor(private http: HttpClient) {
    const savedLang = localStorage.getItem('preferred_language') || 'bg';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    this.currentLang.next(lang);
    localStorage.setItem('preferred_language', lang);
  }

  getCurrentLanguage() {
    return this.currentLang.value;
  }
}
