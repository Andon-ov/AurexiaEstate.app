import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interface for Theme Settings - CSS color palette
 */
export interface ThemeSettings {
  primaryDark: string;
  primaryLight: string;
  background: string;
  text: string;
  white: string;
  accent: string;
  accentHover: string;
  hoverIndigo: string;
  hoverPink: string;
  hoverCyan: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  textDark: string;
  textSecondary: string;
  neutral: string;
  grayLight: string;
  grayMedium: string;
  grayDark: string;
  borderGray: string;
  black: string;
  backgroundSecondary: string;
  backgroundAlt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/generix/theme-settings/`;

  /**
   * Get theme settings from API
   * @returns Observable with theme color palette
   */
  getThemeSettings(): Observable<ThemeSettings> {
    return this.http.get<ThemeSettings>(this.apiUrl);
  }

  /**
   * Apply theme colors to CSS custom properties at runtime
   * @param theme Theme settings object with color values
   */
  applyTheme(theme: ThemeSettings): void {
    const root = document.documentElement;

    // Apply main brand colors
    root.style.setProperty('--color-primary-dark', theme.primaryDark);
    root.style.setProperty('--color-primary-light', theme.primaryLight);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-white', theme.white);

    // Apply additional colors
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-hover', theme.accentHover);

    // Apply platform card hover colors
    root.style.setProperty('--color-hover-indigo', theme.hoverIndigo);
    root.style.setProperty('--color-hover-pink', theme.hoverPink);
    root.style.setProperty('--color-hover-cyan', theme.hoverCyan);

    // Apply semantic colors
    root.style.setProperty('--color-success', theme.success);
    root.style.setProperty('--color-warning', theme.warning);
    root.style.setProperty('--color-error', theme.error);
    root.style.setProperty('--color-info', theme.info);

    // Apply text colors
    root.style.setProperty('--color-text-dark', theme.textDark);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);

    // Apply neutral & gray colors
    root.style.setProperty('--color-neutral', theme.neutral);
    root.style.setProperty('--color-gray-light', theme.grayLight);
    root.style.setProperty('--color-gray-medium', theme.grayMedium);
    root.style.setProperty('--color-gray-dark', theme.grayDark);

    // Apply border colors
    root.style.setProperty('--color-border-gray', theme.borderGray);

    // Apply additional UI colors
    root.style.setProperty('--mainBlackColor', theme.black);
    root.style.setProperty('--backgroundColor', theme.backgroundSecondary);
    root.style.setProperty('--color-background-alt', theme.backgroundAlt);
    
    // Set background-dark to same as primary-dark for consistency
    root.style.setProperty('--color-background-dark', theme.primaryDark);

    // Generate and apply gradients dynamically based on theme colors
    const gradientPrimary = `linear-gradient(135deg, ${theme.primaryDark} 0%, ${theme.primaryLight} 100%)`;
    const gradientButton = `linear-gradient(90deg, ${theme.primaryLight} 0%, ${theme.accentHover} 100%)`;
    const gradientHeader = `linear-gradient(135deg, ${theme.primaryDark} 0%, #003D66 50%, ${theme.primaryLight} 100%)`;
    const gradientOverlay = `linear-gradient(135deg, ${this.hexToRgba(theme.primaryDark, 0.9)}, ${this.hexToRgba(theme.primaryLight, 0.8)})`;
    const gradientCard = `linear-gradient(135deg, ${theme.white} 0%, ${theme.background} 100%)`;
    
    root.style.setProperty('--gradient-primary', gradientPrimary);
    root.style.setProperty('--gradient-button', gradientButton);
    root.style.setProperty('--gradient-header', gradientHeader);
    root.style.setProperty('--gradient-overlay', gradientOverlay);
    root.style.setProperty('--color-gradient-card', gradientCard);
    
    console.log('🎨 Gradients generated:', {
      gradientPrimary,
      gradientButton,
      gradientOverlay
    });

    // Update shadows with theme colors
    root.style.setProperty('--shadow-button', 
      `0 4px 14px ${this.hexToRgba(theme.primaryLight, 0.3)}`);
    
    root.style.setProperty('--shadow-button-hover', 
      `0 6px 20px ${this.hexToRgba(theme.primaryLight, 0.4)}`);
    
    root.style.setProperty('--shadow-card-hover', 
      `0 20px 40px ${this.hexToRgba(theme.primaryLight, 0.15)}`);
  }

  /**
   * Convert hex color to rgba with alpha
   * @param hex Hex color code (e.g., #00B2FF)
   * @param alpha Alpha value (0-1)
   * @returns rgba string
   */
  private hexToRgba(hex: string, alpha: number): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex to RGB
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
    console.log('🔄 Loading theme from API...');
    this.getThemeSettings().subscribe({
      next: (theme) => {
        console.log('📦 Theme received from API:', theme);
        this.applyTheme(theme);
        console.log('✅ Theme loaded and applied successfully');
        console.log('🎨 Check CSS variables in console: getComputedStyle(document.documentElement).getPropertyValue("--color-primary-dark")');
      },
      error: (error) => {
        console.error('❌ Failed to load theme settings:', error);
        console.log('Using default CSS theme colors');
      }
    });
  }
}
