import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.html',
  styleUrls: ['./privacy-policy.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PrivacyPolicyComponent {
  constructor(public translation: TranslationService) { }
}