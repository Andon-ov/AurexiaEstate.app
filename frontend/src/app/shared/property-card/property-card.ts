import { Component, Input } from '@angular/core';
import { PropertyListItem } from '../../core/models/property.model';
import { I18nService } from '../../core/services/i18n.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-property-card',
  standalone: false,
  templateUrl: './property-card.html',
  styleUrl: './property-card.css'
})
export class PropertyCard {
  @Input() property!: PropertyListItem;

  constructor(
    public i18n: I18nService,
    public translation: TranslationService
  ) {}

  get title(): string {
    return this.i18n.getCurrentLanguage() === 'bg' ? this.property.title_bg : this.property.title_en;
  }

  get shortDescription(): string {
    return this.i18n.getCurrentLanguage() === 'bg'
      ? this.property.short_description_bg
      : this.property.short_description_en;
  }

  get destinationName(): string {
    return this.i18n.getCurrentLanguage() === 'bg'
      ? this.property.destination_name_bg
      : this.property.destination_name_en;
  }

  get propertyLink(): string {
    return `/property/${this.property.slug}`;
  }
}
