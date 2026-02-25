# Color System - Simplified Blue Theme

## Overview

This document describes the simplified color system for the Generix.app frontend. The palette has been reduced from 50+ variables to **5 core colors** with ~20 supporting semantic variables for easier maintenance and consistent branding.

## Core Colors (5 Main Colors)

These are the foundation of our visual identity:

```css
--color-primary-dark: #0A1F44;         /* Тъмносиньо – фон, заглавия */
--color-primary-light: #00B2FF;        /* Синьо-зелено – акценти, бутони */
--color-background: #F5F7FA;           /* Светлосиво – основен фон */
--color-text: #3C3C3C;                 /* Тъмносиво – текст */
--color-white: #FFFFFF;                /* Бяло – карти, секции */
```

### Platform Card Hover Colors

За картите на платформите се използват различни цветове при hover:

```css
--color-hover-indigo: #4F46E5;         /* Indigo - първа карта */
--color-hover-pink: #EC4899;           /* Pink - втора карта */
--color-hover-cyan: #06B6D4;           /* Cyan - трета карта */
```

### Usage Guidelines

| Color | Purpose | Examples |
|-------|---------|----------|
| **primary-dark** (#0A1F44) | Dark backgrounds, main headings, footer | Hero sections, nav backgrounds, footers |
| **primary-light** (#00B2FF) | Accent color, hover states, CTAs | Buttons, links on hover, highlights |
| **background** (#F5F7FA) | Page backgrounds, subtle sections | Body background, light sections |
| **text** (#3C3C3C) | Body text, descriptions | Paragraphs, form labels |
| **white** (#FFFFFF) | Cards, overlays, light text | Card backgrounds, light sections |

## Supporting Colors

### Text Variations
```css
--color-text-light: #F3F4F6;          /* Light text on dark backgrounds */
--color-text-secondary: #94A3B8;      /* Secondary/muted text */
--color-text-dark: #1E293B;           /* Extra dark text for emphasis */
```

### Background Variations
```css
--color-background-dark: #0A1F44;     /* Same as primary-dark */
```

### Borders
```css
--color-border: #E5E7EB;              /* Default border */
--color-border-light: #F3F4F6;        /* Light border */
```

### Semantic Colors
```css
--color-success: #10B981;             /* Success states */
--color-warning: #F59E0B;             /* Warning states */
--color-error: #EF4444;               /* Error states */
--color-info: #3B82F6;                /* Info states */
```

### Neutrals
```css
--color-neutral: #F5F7FA;             /* Same as background */
--color-neutral-dark: #64748B;        /* Dark neutral */
```

## Gradients (4 Main Gradients)

Simplified from 12 to 4 essential gradients:

```css
--gradient-primary: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-light) 100%);
--gradient-button: linear-gradient(135deg, var(--color-primary-light) 0%, #0099DD 100%);
--gradient-card: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
--gradient-overlay: linear-gradient(180deg, rgba(10, 31, 68, 0) 0%, rgba(10, 31, 68, 0.8) 100%);
```

## Shadows (8 Standard Shadows)

Reduced from 25+ to 8 semantic shadow variations:

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-card: 0 4px 12px rgba(10, 31, 68, 0.08);
--shadow-button: 0 4px 14px 0 rgba(0, 178, 255, 0.39);
--shadow-hero: 0 25px 50px -12px rgba(10, 31, 68, 0.25);
--shadow-nav: 0 2px 8px rgba(10, 31, 68, 0.06);
```

## Transitions

```css
--transition: all 0.3s ease;
--transition-fast: all 0.15s ease;
--transition-slow: all 0.5s ease;
```

## Migration from Old Palette

### Removed Colors

The following old variables have been replaced:

| Old Variable | New Replacement |
|-------------|-----------------|
| `--color-primary` | `--color-primary-dark` |
| `--color-secondary` | `--color-primary-light` |
| `--color-blue-*` (7 variants) | `--color-primary-dark` or `--color-primary-light` |
| `--color-purple-*` (4 variants) | `--color-primary-dark` |
| `--color-pink-*` (3 variants) | `--color-primary-light` |
| `--color-indigo-*` | `--color-primary-dark` |
| All gradient variations | 4 main gradients |
| Complex shadow system | 8 semantic shadows |

### Before & After Comparison

**Before:** 50+ CSS variables including:
- Multiple blues (#6366F1, #4F46E5, #4338CA, #3730A3, #312E81, #1E1B4B, #1E3A8A)
- Multiple pinks (#EC4899, #DB2777, #BE185D)
- Multiple purples and indigos
- 12 different gradient patterns
- 25+ shadow variations

**After:** ~25 CSS variables:
- 5 core colors
- ~15 supporting semantic colors
- 4 main gradients
- 8 shadow variations

## Benefits of Simplification

1. **Easier Maintenance**: Fewer variables to manage and update
2. **Consistent Branding**: Professional blue theme throughout
3. **Better Performance**: Fewer CSS custom properties to process
4. **Clearer Purpose**: Semantic naming makes usage obvious
5. **Reduced Confusion**: No more choosing between 7 similar blues

## Usage Examples

### Buttons
```css
.primary-button {
  background: var(--gradient-button);
  color: var(--color-white);
  box-shadow: var(--shadow-button);
}

.primary-button:hover {
  background-color: var(--color-primary-light);
}
```

### Cards
```css
.card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
}
```

### Headers
```css
h1 {
  color: var(--color-primary-dark);
  font-weight: 700;
}
```

### Links
```css
a {
  color: var(--color-primary-dark);
}

a:hover {
  color: var(--color-primary-light);
}
```

## File Locations

All color variables are defined in:
```
frontend/src/styles/style.css
```

Lines 131-250+ contain the complete :root block with all color definitions.

## Updated Files

The following files have been updated to use the new simplified color palette:

### Core Styles
- `frontend/src/styles/style.css` - Main :root variables and common styles
- `frontend/src/styles/stylish-components.css` - Utility classes
- `frontend/src/styles/styleFooter.css` - Footer styles

### Shared Components
- `frontend/src/app/shared/hero-slider/hero-slider.css`
- `frontend/src/app/shared/platform-card/platform-card.css`
- `frontend/src/app/shared/platform-features/platform-features.css`
- `frontend/src/app/shared/contact-form/contact-form.css`
- `frontend/src/app/shared/cta/cta.css`
- `frontend/src/app/shared/testimonials-slider/testimonials-slider.css`
- `frontend/src/app/shared/case-studies-slider/case-studies-slider.css`

### Layout Components
- `frontend/src/app/layouts/home-layout/about-us/about-us.css`
- `frontend/src/app/layouts/home-layout/about-us-image/about-us-image.css`
- `frontend/src/app/layouts/home-layout/platforms/platforms.css`
- `frontend/src/app/layouts/home-layout/why-generix/why-generix.css`
- `frontend/src/app/layouts/footer/footer.css`

### TypeScript Files
- `frontend/src/app/core/models/platform-card.model.ts` - Updated hover colors
- `frontend/src/app/shared/platform-card/platform-card.ts` - Updated default fallback color

## Last Updated

January 2025 - Simplified from 50+ to 5 core colors with blue professional theme
