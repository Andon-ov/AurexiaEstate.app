import { Component, Input, OnInit } from '@angular/core';
import { PlatformCard as PlatformCardModel } from '../../core/models/platform-card.model';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-platform-card',
  standalone: false,
  templateUrl: './platform-card.html',
  styleUrl: './platform-card.css',
})
export class PlatformCard implements OnInit {
  @Input() card!: PlatformCardModel;
  @Input() index: number = 0; // Card index for theme color assignment

  currentLang!: string;

  constructor(public translation: TranslationService, public i18n: I18nService) {}

  async ngOnInit() {
    this.currentLang = this.i18n.getCurrentLanguage();
    await this.translation.loadTranslations();
  }

  /**
   * Get hover color CSS variable based on card index
   * Maps to theme settings: 0=indigo, 1=pink, 2=cyan
   */
  getHoverColorVariable(): string {
    const colorMap = [
      'var(--color-hover-indigo)',  // First card
      'var(--color-hover-pink)',    // Second card
      'var(--color-hover-cyan)'     // Third card
    ];
    return colorMap[this.index] || 'var(--color-primary-dark)';
  }
}
