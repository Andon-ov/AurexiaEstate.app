# Color System - Aurexia Estate Dark Luxury Theme

## Overview

This document describes the color system for the Aurexia Estate frontend. The design follows an ultra-luxury dark aesthetic inspired by brands like Sotheby's International Realty.

## Core Colors

### Primary Palette

```css
--color-primary: #0a0a0a;             /* Deep black – main background */
--color-surface: #1a1a1a;             /* Charcoal – cards, sections */
--color-dark-surface: #0f0f0f;        /* Near-black – hover backgrounds */
--color-accent-gold: #c9a84c;         /* Gold – CTAs, accents, borders */
--color-accent-gold-hover: #b39440;   /* Darker gold – hover states */
```

### Text Colors

```css
--color-text-primary: #ffffff;         /* White – main text */
--color-text-secondary: #a0a0a0;       /* Gray – descriptions, labels */
--color-text-muted: #707070;           /* Muted – timestamps, meta */
```

### Border Colors

```css
--color-border: #2a2a2a;              /* Default borders */
--color-border-hover: #3a3a3a;        /* Border on hover */
```

### Usage Guidelines

| Color | Purpose | Examples |
|-------|---------|----------|
| **primary** (#0a0a0a) | Main background | Body, hero sections, page backgrounds |
| **surface** (#1a1a1a) | Elevated surfaces | Cards, sidebar, form backgrounds |
| **accent-gold** (#c9a84c) | Gold accents | Buttons, links, decorative dots, borders |
| **accent-gold-hover** (#b39440) | Hover states | Button hover, link hover |
| **text-primary** (#ffffff) | Main text | Headings, body text on dark backgrounds |
| **text-secondary** (#a0a0a0) | Secondary text | Descriptions, subtitles, meta info |
| **border** (#2a2a2a) | Subtle borders | Card borders, section dividers |

## Typography

### Fonts

```css
font-heading: 'Cormorant Garamond', serif;   /* Headings – elegant serif */
font-body: 'Montserrat', sans-serif;          /* Body – clean sans-serif */
```

### Font Usage

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 (Hero) | Cormorant Garamond | 300-400 | 2.5-3rem |
| H2 (Section) | Cormorant Garamond | 400 | 2-2.5rem |
| H3 (Card title) | Cormorant Garamond | 600 | 1.2-1.5rem |
| Body text | Montserrat | 400 | 0.85-0.95rem |
| Buttons | Montserrat | 500-600 | 0.75-0.85rem |
| Labels/Meta | Montserrat | 500 | 0.7-0.8rem |
| Logo | Cormorant Garamond | 400 | 1.6rem |

### Logo Styling

```css
.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 400;
  letter-spacing: 6px;
  color: #ffffff;
}

.logo-accent {
  color: #c9a84c;  /* Gold dot after "AUREXIA" */
}
```

## Patterns & Effects

### Card Hover Effect

```css
.card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  transition: all 0.4s ease;
}

.card:hover {
  border-color: #c9a84c;
  transform: translateY(-4px);
}
```

### Gold Button

```css
.button-gold {
  background: #c9a84c;
  color: #0a0a0a;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.button-gold:hover {
  background: #b39440;
}
```

### Outline Button

```css
.button-outline {
  background: transparent;
  border: 1px solid #c9a84c;
  color: #c9a84c;
}

.button-outline:hover {
  background: #c9a84c;
  color: #0a0a0a;
}
```

### Section Title with Gold Dot

```css
.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 2px;
  background: #c9a84c;
  margin-top: 16px;
}
```

## Responsive Breakpoints

```css
/* Mobile first, then override: */
@media (min-width: 768px)  { /* Tablet */  }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1200px) { /* Wide */    }
```

## Aurexia Component Files

### Shared Components
- `shared/property-card/property-card.css` - Property listing cards
- `shared/destination-card/destination-card.css` - Destination cards
- `shared/consultation-form/consultation-form.css` - Inquiry forms

### Pages
- `pages/home/home.css` - Homepage (hero, featured, destinations)
- `pages/portfolio/portfolio.css` - Property portfolio
- `pages/destinations/destinations.css` - Destinations listing
- `pages/destination-detail/destination-detail.css` - Destination detail
- `pages/property-detail/property-detail.css` - Property detail
- `pages/service-model/service-model.css` - Service model page
- `pages/developer-partnership/developer-partnership.css` - Developer partnership

### Layouts
- `layouts/header/header.css` - Navigation with text logo
- `layouts/footer/footer.css` - Footer with column layout

## Last Updated

February 2026 - Rewritten for Aurexia Estate dark luxury theme (replaced old Generix blue theme)
