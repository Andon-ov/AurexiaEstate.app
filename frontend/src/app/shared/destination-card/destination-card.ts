import { Component, Input } from '@angular/core';
import { Destination } from '../../core/models/destination.model';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-destination-card',
  standalone: false,
  templateUrl: './destination-card.html',
  styleUrl: './destination-card.css'
})
export class DestinationCard {
  @Input() destination!: Destination;

  constructor(
    public i18n: I18nService,
    public translation: TranslationService
  ) {}

  get name(): string {
    return this.i18n.getCurrentLanguage() === 'bg' ? this.destination.name_bg : this.destination.name_en;
  }

  get shortDescription(): string {
    return this.i18n.getCurrentLanguage() === 'bg'
      ? this.destination.short_description_bg
      : this.destination.short_description_en;
  }

  get destinationLink(): string {
    return `/destinations/${this.destination.slug}`;
  }
}
