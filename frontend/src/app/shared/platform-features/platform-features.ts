import { Component, Input, OnInit } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { PlatformFeature } from '../../core/models/platform-feature.model';

@Component({
  selector: 'app-platform-features',
  templateUrl: './platform-features.html',
  styleUrls: ['./platform-features.css'],
  standalone: false
})
export class PlatformFeaturesComponent implements OnInit {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() features: PlatformFeature[] = [];
  @Input() readMoreText: string = 'Read More';

  constructor(public translation: TranslationService) { }

  ngOnInit(): void {
    // Default implementation
  }
}