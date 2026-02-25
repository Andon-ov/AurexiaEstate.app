import { Component, signal, inject, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    // Load and apply theme from database on app initialization
    this.themeService.loadAndApplyTheme();
  }
}
