/**
 * Enhanced Storage System
 * 
 * This file provides backward-compatible functions that use the new structured database
 * while maintaining the same API as the old storage system.
 */

import {
  initDatabase,
  getDatabase,
  saveImage,
  getLatestImageByType,
  getAllImages,
  saveEvent,
  getAllEvents,
  deleteEvent,
  saveGalleryCategory,
  getAllGalleryCategories,
  saveGalleryImage,
  getGalleryImagesByCategory,
  saveContactSubmission,
  getAllContactSubmissions,
  migrateFromOldStorage,
  type ImageRecord,
  type EventRecord,
  type GalleryCategoryRecord,
  type GalleryImageRecord,
  type ContactSubmissionRecord,
} from "./database";

type SiteConfig = {
  heroImage?: string;
  communityImage?: string;
  aboutMainImage?: string;
  aboutPastorImage?: string;
  events: any[];
  galleryCategories: any[];
  galleryImages: any[];
  contactSubmissions?: any[];
};

let migrationDone = false;

/**
 * Initialize the enhanced storage system
 */
export const initEnhancedStorage = async (): Promise<void> => {
  try {
    await initDatabase();
    
    // Run migration once
    if (!migrationDone) {
      await migrateFromOldStorage();
      migrationDone = true;
    }
  } catch (error) {
    console.error("Failed to initialize enhanced storage:", error);
  }
};

/**
 * Save configuration - uses new database structure
 */
export const saveConfig = async (config: SiteConfig): Promise<void> => {
  await initEnhancedStorage();

  try {
    // Save images to image database
    if (config.heroImage) {
      await saveImage({
        type: "hero",
        src: config.heroImage,
      });
    }
    if (config.communityImage) {
      await saveImage({
        type: "community",
        src: config.communityImage,
      });
    }
    if (config.aboutMainImage) {
      await saveImage({
        type: "about-main",
        src: config.aboutMainImage,
      });
    }
    if (config.aboutPastorImage) {
      await saveImage({
        type: "about-pastor",
        src: config.aboutPastorImage,
      });
    }

    // Save events - update existing or create new
    if (config.events && config.events.length > 0) {
      const existingEvents = await getAllEvents();
      const existingEventIds = new Set(existingEvents.map(e => e.id));
      
      for (const event of config.events) {
        if (event.id && existingEventIds.has(event.id)) {
          // Event exists, update it
          const database = await getDatabase();
          const transaction = database.transaction(["events"], "readwrite");
          const store = transaction.objectStore("events");
          await new Promise<void>((resolve, reject) => {
            const request = store.put(event);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        } else {
          // New event, create it
          await saveEvent(event);
        }
      }
    }

    // Save gallery categories
    if (config.galleryCategories) {
      for (const category of config.galleryCategories) {
        if (!category.id) {
          await saveGalleryCategory(category);
        }
      }
    }

    // Save gallery images
    if (config.galleryImages) {
      for (const image of config.galleryImages) {
        if (!image.id) {
          await saveGalleryImage(image);
          // Also save as image record
          await saveImage({
            type: "gallery",
            src: image.src,
            categoryId: image.categoryId,
            caption: image.caption,
            date: image.date,
          });
        }
      }
    }

    // Save contact submissions
    if (config.contactSubmissions) {
      for (const submission of config.contactSubmissions) {
        if (!submission.id) {
          await saveContactSubmission(submission);
        }
      }
    }

    // Also save to legacy storage for backward compatibility
    await saveToLegacyStorage(config);

    console.log("✓ Configuration saved to enhanced database");
  } catch (error) {
    console.error("Failed to save configuration:", error);
    throw error;
  }
};

/**
 * Load configuration - uses new database structure
 */
export const loadConfig = async (): Promise<SiteConfig | null> => {
  await initEnhancedStorage();

  try {
    // Load images
    const heroImage = await getLatestImageByType("hero");
    const communityImage = await getLatestImageByType("community");
    const aboutMainImage = await getLatestImageByType("about-main");
    const aboutPastorImage = await getLatestImageByType("about-pastor");

    // Load events
    const events = await getAllEvents();

    // Load gallery categories
    const galleryCategories = await getAllGalleryCategories();

    // Load gallery images
    const allGalleryImages: GalleryImageRecord[] = [];
    for (const category of galleryCategories) {
      const categoryImages = await getGalleryImagesByCategory(category.id);
      allGalleryImages.push(...categoryImages);
    }

    // Load contact submissions
    const contactSubmissions = await getAllContactSubmissions();

    const config: SiteConfig = {
      heroImage: heroImage?.src,
      communityImage: communityImage?.src,
      aboutMainImage: aboutMainImage?.src,
      aboutPastorImage: aboutPastorImage?.src,
      events: events.map(e => ({
        id: e.id,
        day: e.day,
        month: e.month,
        title: e.title,
        description: e.description,
        time: e.time,
        location: e.location,
        featured: e.featured,
      })),
      galleryCategories: galleryCategories.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        date: c.date,
      })),
      galleryImages: allGalleryImages.map(img => ({
        id: img.id,
        src: img.src,
        categoryId: img.categoryId,
        date: img.date,
        caption: img.caption,
      })),
      contactSubmissions: contactSubmissions.map(sub => ({
        id: sub.id,
        name: sub.name,
        email: sub.email,
        phone: sub.phone,
        message: sub.message,
        date: sub.date,
        read: sub.read,
      })),
    };

    // If we have data, return it
    if (config.heroImage || config.events.length > 0 || config.galleryCategories.length > 0) {
      return config;
    }

    // Fallback to legacy storage
    return await loadFromLegacyStorage();
  } catch (error) {
    console.error("Failed to load from enhanced storage, trying legacy:", error);
    return await loadFromLegacyStorage();
  }
};

/**
 * Legacy storage functions for backward compatibility
 */
const saveToLegacyStorage = async (config: SiteConfig): Promise<void> => {
  try {
    // Save to old IndexedDB for backward compatibility
    const request = indexedDB.open("icgc-site-db", 1);
    request.onsuccess = () => {
      const db = request.result;
      if (db.objectStoreNames.contains("site-config")) {
        const transaction = db.transaction(["site-config"], "readwrite");
        const store = transaction.objectStore("site-config");
        store.put(config, "config");
      }
    };

    // Also save lightweight version to localStorage
    const lightweightConfig = {
      events: config.events,
      galleryCategories: config.galleryCategories,
      contactSubmissions: config.contactSubmissions,
    };
    localStorage.setItem("icgc-site-config-light", JSON.stringify(lightweightConfig));
  } catch (error) {
    console.warn("Failed to save to legacy storage:", error);
  }
};

const loadFromLegacyStorage = async (): Promise<SiteConfig | null> => {
  try {
    // Try old IndexedDB
    const request = indexedDB.open("icgc-site-db", 1);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const db = request.result;
        if (db.objectStoreNames.contains("site-config")) {
          const transaction = db.transaction(["site-config"], "readonly");
          const store = transaction.objectStore("site-config");
          const getRequest = store.get("config");
          getRequest.onsuccess = () => {
            if (getRequest.result) {
              resolve(getRequest.result);
            } else {
              // Try localStorage
              const saved = localStorage.getItem("icgc-site-config");
              if (saved) {
                resolve(JSON.parse(saved));
              } else {
                resolve(null);
              }
            }
          };
          getRequest.onerror = () => {
            resolve(null);
          };
        } else {
          resolve(null);
        }
      };
      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (error) {
    console.warn("Failed to load from legacy storage:", error);
    return null;
  }
};

/**
 * Compress image to reduce storage size
 */
export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Use JPEG for better compression, but preserve PNG if original was PNG and is small
        const useJPEG = file.type !== "image/png" || (width * height) > 500000;
        const mimeType = useJPEG ? "image/jpeg" : "image/png";
        const compressedDataUrl = canvas.toDataURL(mimeType, useJPEG ? quality : undefined);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

