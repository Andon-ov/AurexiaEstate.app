import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  currentLang!: string;
  constructor(public translation: TranslationService, public i18n: I18nService) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
  }
}
