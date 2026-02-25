import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.html',
  styleUrls: ['./cookie-policy.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CookiePolicyComponent {
  constructor(public translation: TranslationService) { }
}