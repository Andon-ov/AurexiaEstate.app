import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultTitle = 'Generix - Insurance Platform Solutions';
  private defaultDescription = 'Intelligent insurance platform solutions for self-service and corporate business. Automate workflows and deliver seamless digital experiences.';
  private defaultImage = 'http://generix.publicvm.com/assets/images/og-image.png';
  private baseUrl = 'http://generix.publicvm.com';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router
  ) {
    // Update canonical URL on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentUrl = this.baseUrl + event.urlAfterRedirects;
      this.updateCanonicalUrl(currentUrl);
    });
  }

  /**
   * Update all SEO meta tags
   */
  updateSEOTags(data: Partial<SEOData>): void {
    // Title
    const title = data.title || this.defaultTitle;
    this.titleService.setTitle(title);

    // Description
    const description = data.description || this.defaultDescription;
    this.updateOrCreateMetaTag('name', 'description', description);

    // Keywords
    if (data.keywords) {
      this.updateOrCreateMetaTag('name', 'keywords', data.keywords);
    }

    // Robots
    const robots = data.robots || 'index, follow';
    this.updateOrCreateMetaTag('name', 'robots', robots);

    // Open Graph tags
    this.updateOrCreateMetaTag('property', 'og:title', data.ogTitle || title);
    this.updateOrCreateMetaTag('property', 'og:description', data.ogDescription || description);
    this.updateOrCreateMetaTag('property', 'og:image', data.ogImage || this.defaultImage);
    this.updateOrCreateMetaTag('property', 'og:url', data.ogUrl || this.router.url);
    this.updateOrCreateMetaTag('property', 'og:type', 'website');

    // Twitter Card tags
    this.updateOrCreateMetaTag('property', 'twitter:card', data.twitterCard || 'summary_large_image');
    this.updateOrCreateMetaTag('property', 'twitter:title', data.twitterTitle || title);
    this.updateOrCreateMetaTag('property', 'twitter:description', data.twitterDescription || description);
    this.updateOrCreateMetaTag('property', 'twitter:image', data.twitterImage || this.defaultImage);

    // Canonical URL
    if (data.canonical) {
      this.updateCanonicalUrl(data.canonical);
    }
  }

  /**
   * Update or create meta tag
   */
  private updateOrCreateMetaTag(attrName: string, attrValue: string, content: string): void {
    const selector = `${attrName}="${attrValue}"`;
    
    if (this.metaService.getTag(selector)) {
      this.metaService.updateTag({ [attrName]: attrValue, content });
    } else {
      this.metaService.addTag({ [attrName]: attrValue, content });
    }
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    // Remove existing canonical link
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.setAttribute('href', url);
    } else {
      // Create new canonical link
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }

  /**
   * Set language alternate links (hreflang)
   */
  setLanguageAlternates(path: string): void {
    // Remove existing alternate links
    const existingLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingLinks.forEach(link => link.remove());

    // Add new alternate links
    const languages = ['en', 'bg'];
    languages.forEach(lang => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', `${this.baseUrl}${path}?lang=${lang}`);
      document.head.appendChild(link);
    });

    // Add x-default
    const defaultLink = document.createElement('link');
    defaultLink.setAttribute('rel', 'alternate');
    defaultLink.setAttribute('hreflang', 'x-default');
    defaultLink.setAttribute('href', `${this.baseUrl}${path}`);
    document.head.appendChild(defaultLink);
  }

  /**
   * Add breadcrumb structured data
   */
  addBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>): void {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${this.baseUrl}${item.url}`
      }))
    };

    // Remove existing breadcrumb script
    const existingScript = document.querySelector('script[data-breadcrumb]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new breadcrumb script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb', 'true');
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * Reset to default SEO tags
   */
  resetToDefaults(): void {
    this.updateSEOTags({
      title: this.defaultTitle,
      description: this.defaultDescription,
      ogImage: this.defaultImage
    });
  }
}
