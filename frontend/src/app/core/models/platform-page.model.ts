import { PlatformFeature } from './platform-feature.model';
import { CORPORATE_BUSINESS_CONTENT } from './corporate-business.model';
import { SELF_SERVICE_CONTENT } from './self-service.model';

export interface PlatformPageData {
  type: 'self-service' | 'corporate-business';
  heroTitleKey: string;
  title: string;
  subtitle: string;
  features: PlatformFeature[];
  readMoreText: string;
  containerClass: string;
  heroClass: string;
  bgImageUrl?: string; // Optional URL for custom background
  metaTitle?: string; // For SEO
  metaDescription?: string; // For SEO
}

/**
 * Фабрика за генериране на данни за страница според типа
 * Note: Features are now loaded from API in the component
 */
export function getPlatformPageData(type: string): PlatformPageData {
  switch(type) {
    case 'self-service':
      return {
        type: 'self-service',
        heroTitleKey: 'features.selfService.title',
        title: SELF_SERVICE_CONTENT.title,
        subtitle: SELF_SERVICE_CONTENT.subtitle,
        features: [], // Features loaded from API
        readMoreText: SELF_SERVICE_CONTENT.readMore,
        containerClass: 'self-service-container',
        heroClass: 'self-service-hero',
        bgImageUrl: 'https://www.scalefocus.com/wp-content/uploads/2025/02/SF_Website_Headers01-3.webp',
        metaTitle: 'platforms.meta.selfServiceTitle',
        metaDescription: 'platforms.meta.selfServiceDescription'
      };
    case 'corporate-business':
      return {
        type: 'corporate-business',
        heroTitleKey: 'features.corporate.title',
        title: CORPORATE_BUSINESS_CONTENT.title,
        subtitle: CORPORATE_BUSINESS_CONTENT.subtitle,
        features: [], // Features loaded from API
        readMoreText: CORPORATE_BUSINESS_CONTENT.readMore,
        containerClass: 'corporate-business-container',
        heroClass: 'corporate-business-hero',
        bgImageUrl: 'https://www.scalefocus.com/wp-content/uploads/2025/02/SF_Website_Headers01-3.webp',
        metaTitle: 'platforms.meta.corporateBusinessTitle',
        metaDescription: 'platforms.meta.corporateBusinessDescription'
      };
    default:
      // Return self-service as fallback instead of throwing error
      console.warn(`Unknown platform type: ${type}, defaulting to self-service`);
      return {
        type: 'self-service',
        heroTitleKey: 'features.selfService.title',
        title: SELF_SERVICE_CONTENT.title,
        subtitle: SELF_SERVICE_CONTENT.subtitle,
        features: [], // Features loaded from API
        readMoreText: SELF_SERVICE_CONTENT.readMore,
        containerClass: 'self-service-container',
        heroClass: 'self-service-hero',
        bgImageUrl: 'https://www.scalefocus.com/wp-content/uploads/2025/02/SF_Website_Headers01-3.webp',
        metaTitle: 'platforms.meta.selfServiceTitle',
        metaDescription: 'platforms.meta.selfServiceDescription'
      };
  }
}