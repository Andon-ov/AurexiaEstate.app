// core/models/corporate-business.model.ts
/**
 * Model definition for Corporate Business features
 * Features are now loaded from the backend API via PlatformService
 */

import { PlatformFeature } from './platform-feature.model';
import { PlatformSectionContent } from './platform-section.model';

export interface CorporateBusinessFeature extends PlatformFeature {}

/**
 * Constants for Corporate Business section
 */
export const CORPORATE_BUSINESS_CONTENT: PlatformSectionContent = {
  title: 'features.corporate.title',
  subtitle: 'features.corporate.subtitle',
  readMore: 'features.readMore'
};