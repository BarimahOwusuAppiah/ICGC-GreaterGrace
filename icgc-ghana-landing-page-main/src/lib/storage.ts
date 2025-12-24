/**
 * IndexedDB storage utility for persisting site configuration
 * Uses IndexedDB instead of localStorage to handle large image data
 */

const DB_NAME = "icgc-site-db";
const DB_VERSION = 1;
const STORE_NAME = "site-config";

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

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB database
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open database"));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
};

/**
 * Save configuration - ALWAYS saves to IndexedDB (for images), localStorage for small data
 */
export const saveConfig = async (config: SiteConfig): Promise<void> => {
  const configString = JSON.stringify(config);
  const configSize = new Blob([configString]).size;
  const hasImages = !!(config.heroImage || config.communityImage || config.aboutMainImage || config.aboutPastorImage || (config.galleryImages && config.galleryImages.length > 0));
  
  console.log(`Saving config (${(configSize / 1024 / 1024).toFixed(2)} MB)`, {
    hasImages,
    imageCount: config.galleryImages?.length || 0,
  });
  
  // ALWAYS save to IndexedDB first (required for images)
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("✓ Saved to IndexedDB (primary)");
        resolve();
      };
      transaction.onerror = () => {
        console.error("IndexedDB transaction failed:", transaction.error);
        reject(transaction.error);
      };
      
      const request = store.put(config, "config");
      request.onsuccess = () => {
        // Request succeeded, wait for transaction.oncomplete
      };
      request.onerror = () => {
        console.error("IndexedDB put failed:", request.error);
        reject(request.error);
      };
    });
  } catch (indexedError) {
    console.error("IndexedDB save failed:", indexedError);
    throw new Error("Failed to save to IndexedDB - images require IndexedDB storage");
  }
  
  // Also try localStorage for faster access (but don't fail if it doesn't work)
  // Only save non-image data to localStorage if images are present
  if (hasImages) {
    // If images exist, save a lightweight version without images to localStorage
    const lightweightConfig = {
      events: config.events,
      galleryCategories: config.galleryCategories,
      contactSubmissions: config.contactSubmissions,
      // Don't include images in localStorage
    };
    try {
      localStorage.setItem("icgc-site-config-light", JSON.stringify(lightweightConfig));
      console.log("✓ Saved lightweight config to localStorage");
    } catch (e) {
      console.warn("Failed to save lightweight config to localStorage (non-critical):", e);
    }
  } else {
    // No images, safe to save full config to localStorage
    try {
      localStorage.setItem("icgc-site-config", configString);
      const verify = localStorage.getItem("icgc-site-config");
      if (verify === configString) {
        console.log("✓ Saved to localStorage and verified");
      }
    } catch (localError: any) {
      if (localError.name === "QuotaExceededError" || localError.code === 22) {
        console.warn("localStorage quota exceeded (non-critical, IndexedDB has full data)");
      } else {
        console.warn("localStorage save failed (non-critical):", localError);
      }
    }
  }
};

/**
 * Load configuration - ALWAYS tries IndexedDB first (for images), localStorage as fallback
 */
export const loadConfig = async (): Promise<SiteConfig | null> => {
  // Primary: ALWAYS try IndexedDB first (required for images)
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    
    const config = await new Promise<SiteConfig | null>((resolve, reject) => {
      const request = store.get("config");
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          console.log("✓ Loaded from IndexedDB", {
            hasHeroImage: !!result.heroImage,
            hasGalleryImages: !!(result.galleryImages && result.galleryImages.length > 0),
          });
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => {
        console.error("Failed to load from IndexedDB:", request.error);
        reject(request.error);
      };
    });
    
    if (config) {
      return config;
    }
  } catch (error) {
    console.warn("Failed to load from IndexedDB:", error);
  }
  
  // Fallback: Try localStorage (might have lightweight version)
  try {
    const saved = localStorage.getItem("icgc-site-config");
    if (saved) {
      const config = JSON.parse(saved) as SiteConfig;
      console.log("✓ Loaded from localStorage (fallback - may be missing images)");
      return config;
    }
    
    // Try lightweight version
    const lightSaved = localStorage.getItem("icgc-site-config-light");
    if (lightSaved) {
      const lightConfig = JSON.parse(lightSaved);
      console.log("⚠ Loaded lightweight config from localStorage (images missing - need IndexedDB)");
      // Return null to indicate incomplete data
      return null;
    }
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
  }
  
  console.log("No saved configuration found");
  return null;
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

