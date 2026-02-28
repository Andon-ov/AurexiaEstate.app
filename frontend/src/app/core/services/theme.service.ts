import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interface matching Django ThemeSettings API response (snake_case)
 */
export interface ThemeSettings {
  id: number;
  // Brand colors
  color_primary: string;
  color_surface: string;
  color_accent_gold: string;
  color_accent_gold_hover: string;
  // Text colors
  color_text_primary: string;
  color_text_secondary: string;
  color_text_muted: string;
  // Semantic colors
  color_success: string;
  color_warning: string;
  color_error: string;
  color_info: string;
  // UI colors
  color_white: string;
  color_black: string;
  color_border: string;
  color_overlay: string;
  // Typography
  font_heading: string;
  font_body: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/aurexia/theme-settings/`;

  /**
   * Get theme settings from API
   * @returns Observable with theme color palette
   */
  getThemeSettings(): Observable<ThemeSettings> {
    return this.http.get<ThemeSettings>(this.apiUrl);
  }

  /**
   * Apply theme colors to CSS custom properties at runtime.
   * Sets BOTH Aurexia-specific variables (--color-primary, --color-surface, etc.)
   * AND legacy aliases (--color-primary-dark, --color-primary-light, etc.)
   * so all components work consistently.
   */
  applyTheme(theme: ThemeSettings): void {
    const root = document.documentElement;

    // === Aurexia brand colors ===
    root.style.setProperty('--color-primary', theme.color_primary);
    root.style.setProperty('--color-surface', theme.color_surface);
    root.style.setProperty('--color-accent-gold', theme.color_accent_gold);
    root.style.setProperty('--color-accent-gold-hover', theme.color_accent_gold_hover);

    // === Legacy aliases (used by shared/layout components) ===
    root.style.setProperty('--color-primary-dark', theme.color_primary);
    root.style.setProperty('--color-primary-light', theme.color_accent_gold);
    root.style.setProperty('--color-background', theme.color_primary);
    root.style.setProperty('--color-background-dark', theme.color_primary);
    root.style.setProperty('--color-background-alt', theme.color_surface);
    root.style.setProperty('--color-accent', theme.color_accent_gold);
    root.style.setProperty('--color-accent-hover', theme.color_accent_gold_hover);

    // === Text colors ===
    root.style.setProperty('--color-text-primary', theme.color_text_primary);
    root.style.setProperty('--color-text', theme.color_text_primary);
    root.style.setProperty('--color-text-light', theme.color_text_primary);
    root.style.setProperty('--color-text-dark', theme.color_text_primary);
    root.style.setProperty('--color-text-secondary', theme.color_text_secondary);
    root.style.setProperty('--color-text-muted', theme.color_text_muted);

    // === Semantic colors ===
    root.style.setProperty('--color-success', theme.color_success);
    root.style.setProperty('--color-warning', theme.color_warning);
    root.style.setProperty('--color-error', theme.color_error);
    root.style.setProperty('--color-info', theme.color_info);

    // === UI colors ===
    root.style.setProperty('--color-white', theme.color_white);
    root.style.setProperty('--mainBlackColor', theme.color_black);
    root.style.setProperty('--color-border', theme.color_border);
    root.style.setProperty('--color-border-gray', theme.color_border);
    root.style.setProperty('--color-overlay', theme.color_overlay);
    root.style.setProperty('--mainColor', theme.color_accent_gold);
    root.style.setProperty('--backgroundColor', theme.color_primary);

    // === Neutral / gray (derived from theme) ===
    root.style.setProperty('--color-neutral', theme.color_primary);
    root.style.setProperty('--color-gray-light', theme.color_text_secondary);
    root.style.setProperty('--color-gray-medium', theme.color_text_muted);

    // === Typography ===
    root.style.setProperty('--font-heading', `"${theme.font_heading}", serif`);
    root.style.setProperty('--font-body', `"${theme.font_body}", sans-serif`);

    // === Gradients (generated from theme colors) ===
    const gradientPrimary = `linear-gradient(135deg, ${theme.color_primary} 0%, ${theme.color_surface} 100%)`;
    const gradientButton = `linear-gradient(90deg, ${theme.color_accent_gold} 0%, ${theme.color_accent_gold_hover} 100%)`;
    const gradientHeader = `linear-gradient(135deg, ${theme.color_primary} 0%, ${theme.color_surface} 50%, ${theme.color_primary} 100%)`;
    const gradientOverlay = `linear-gradient(135deg, ${this.hexToRgba(theme.color_primary, 0.9)}, ${this.hexToRgba(theme.color_surface, 0.8)})`;
    const gradientCard = `linear-gradient(135deg, ${theme.color_surface} 0%, ${theme.color_primary} 100%)`;

    root.style.setProperty('--gradient-primary', gradientPrimary);
    root.style.setProperty('--gradient-button', gradientButton);
    root.style.setProperty('--gradient-header', gradientHeader);
    root.style.setProperty('--gradient-overlay', gradientOverlay);
    root.style.setProperty('--color-gradient-card', gradientCard);

    // === Shadows (using gold accent for glow effects) ===
    root.style.setProperty('--shadow-button',
      `0 4px 14px ${this.hexToRgba(theme.color_accent_gold, 0.3)}`);
    root.style.setProperty('--shadow-button-hover',
      `0 6px 20px ${this.hexToRgba(theme.color_accent_gold, 0.4)}`);
    root.style.setProperty('--shadow-card-hover',
      `0 20px 40px ${this.hexToRgba(theme.color_accent_gold, 0.15)}`);

    console.log('🎨 Aurexia theme applied:', {
      primary: theme.color_primary,
      surface: theme.color_surface,
      gold: theme.color_accent_gold,
      textPrimary: theme.color_text_primary,
      fonts: `${theme.font_heading} / ${theme.font_body}`
    });
  }

  /**
   * Convert hex color to rgba with alpha
   * @param hex Hex color code (e.g., #c9a84c)
   * @param alpha Alpha value (0-1)
   * @returns rgba string
   */
  private hexToRgba(hex: string, alpha: number): string {
    hex = hex.replace('#', '');
    // Handle 8-digit hex (with alpha channel like #00000080)
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Load and apply theme from API
   * Call this on app initialization
   */
  loadAndApplyTheme(): void {
    console.log('🔄 Loading Aurexia theme from API...');
    this.getThemeSettings().subscribe({
      next: (theme) => {
        console.log('📦 Theme received from API:', theme);
        this.applyTheme(theme);
        console.log('✅ Aurexia theme loaded and applied successfully');
      },
      error: (error) => {
        console.error('❌ Failed to load theme settings:', error);
        console.log('Using default CSS theme colors (dark luxury fallback)');
      }
    });
  }
}
