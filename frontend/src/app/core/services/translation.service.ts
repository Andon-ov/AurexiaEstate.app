// core/services/translation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translations: any = {};

  constructor(private http: HttpClient, private i18n: I18nService) {}

  async loadTranslations(): Promise<void> {
    const lang = this.i18n.getCurrentLanguage();
    const data = await this.http.get(`/assets/i18n/${lang}.json`).toPromise();
    this.translations = data;
  }

  t(path: string): string {
    return path.split('.').reduce((acc, key) => acc?.[key], this.translations) || path;
  }
}
