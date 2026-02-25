/**
 * Generic model for platform features
 * Matches API response from /api/generix/platform-features/<slug>/
 */

export interface PlatformFeature {
  title: string;
  description: string;
  iconUrl: string;
  link?: string; // Optional, for future use
}