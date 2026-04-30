/**
 * IndexedDB storage utility for persisting site configuration
 * Uses IndexedDB instead of localStorage to handle large image data
 * 
 * This file now uses the enhanced database system with separate stores
 * for images and website content while maintaining backward compatibility
 */

// Re-export all functions from enhanced storage
export { 
  initEnhancedStorage,
  saveConfig,
  loadConfig,
  compressImage,
} from "./storage-enhanced";

// Export the SiteConfig type for backward compatibility
export type SiteConfig = {
  heroImage?: string;
  communityImage?: string;
  aboutMainImage?: string;
  aboutPastorImage?: string;
  events: any[];
  galleryCategories: any[];
  galleryImages: any[];
  contactSubmissions?: any[];
};
