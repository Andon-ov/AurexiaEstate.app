/**
 * Model definition for Self-Service features
 * Features are now loaded from the backend API via PlatformService
 */

import { PlatformFeature } from './platform-feature.model';
import { PlatformSectionContent } from './platform-section.model';

export interface SelfServiceFeature extends PlatformFeature {}

/**
 * Constants for Self-Service section
 */
export const SELF_SERVICE_CONTENT: PlatformSectionContent = {
  title: 'features.selfService.title',
  subtitle: 'features.selfService.subtitle',
  readMore: 'features.readMore'
};
