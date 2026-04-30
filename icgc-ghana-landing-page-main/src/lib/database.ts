/**
 * Enhanced Database System for ICGC Website
 * 
 * This database system provides structured storage for:
 * 1. Images - All images uploaded through admin page
 * 2. Website Content - All information placed on the website
 * 
 * Uses IndexedDB with multiple object stores for better organization
 */

const DB_NAME = "icgc-website-db";
const DB_VERSION = 2; // Incremented for schema changes

// Object Store Names
const STORES = {
  IMAGES: "images",
  WEBSITE_CONTENT: "website_content",
  EVENTS: "events",
  GALLERY_CATEGORIES: "gallery_categories",
  GALLERY_IMAGES: "gallery_images",
  CONTACT_SUBMISSIONS: "contact_submissions",
} as const;

// Image Types
export type ImageType = 
  | "hero" 
  | "about-main" 
  | "about-pastor" 
  | "community" 
  | "gallery";

// Image Record
export interface ImageRecord {
  id: string;
  type: ImageType;
  src: string; // base64 data URL or remote URL
  filename?: string;
  uploadedAt: string; // ISO date string
  size?: number; // size in bytes
  width?: number;
  height?: number;
  categoryId?: string; // for gallery images
  caption?: string; // for gallery images
  date?: string; // for gallery images
}

// Website Content Types
export type ContentType = 
  | "event"
  | "gallery_category"
  | "contact_submission"
  | "site_settings";

// Website Content Record
export interface WebsiteContentRecord {
  id: string;
  type: ContentType;
  data: any; // flexible data structure based on type
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Event Data Structure
export interface EventData {
  day: string;
  month: string;
  title: string;
  description: string;
  time: string;
  location: string;
  featured: boolean;
}

// Gallery Category Data Structure
export interface GalleryCategoryData {
  name: string;
  description?: string;
  date?: string;
}

// Contact Submission Data Structure
export interface ContactSubmissionData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
}

let db: IDBDatabase | null = null;

/**
 * Initialize the database with proper schema
 */
export const initDatabase = (): Promise<IDBDatabase> => {
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
      
      // Create Images Store
      if (!database.objectStoreNames.contains(STORES.IMAGES)) {
        const imageStore = database.createObjectStore(STORES.IMAGES, {
          keyPath: "id",
        });
        imageStore.createIndex("type", "type", { unique: false });
        imageStore.createIndex("categoryId", "categoryId", { unique: false });
        imageStore.createIndex("uploadedAt", "uploadedAt", { unique: false });
      }

      // Create Website Content Store
      if (!database.objectStoreNames.contains(STORES.WEBSITE_CONTENT)) {
        const contentStore = database.createObjectStore(STORES.WEBSITE_CONTENT, {
          keyPath: "id",
        });
        contentStore.createIndex("type", "type", { unique: false });
        contentStore.createIndex("createdAt", "createdAt", { unique: false });
      }

      // Create Events Store (for backward compatibility and easier queries)
      if (!database.objectStoreNames.contains(STORES.EVENTS)) {
        const eventStore = database.createObjectStore(STORES.EVENTS, {
          keyPath: "id",
        });
        eventStore.createIndex("featured", "featured", { unique: false });
        eventStore.createIndex("date", "date", { unique: false });
      }

      // Create Gallery Categories Store
      if (!database.objectStoreNames.contains(STORES.GALLERY_CATEGORIES)) {
        database.createObjectStore(STORES.GALLERY_CATEGORIES, {
          keyPath: "id",
        });
      }

      // Create Gallery Images Store
      if (!database.objectStoreNames.contains(STORES.GALLERY_IMAGES)) {
        const galleryImageStore = database.createObjectStore(STORES.GALLERY_IMAGES, {
          keyPath: "id",
        });
        galleryImageStore.createIndex("categoryId", "categoryId", { unique: false });
      }

      // Create Contact Submissions Store
      if (!database.objectStoreNames.contains(STORES.CONTACT_SUBMISSIONS)) {
        const contactStore = database.createObjectStore(STORES.CONTACT_SUBMISSIONS, {
          keyPath: "id",
        });
        contactStore.createIndex("read", "read", { unique: false });
        contactStore.createIndex("date", "date", { unique: false });
      }
    };
  });
};

/**
 * Get database instance
 */
export const getDatabase = async (): Promise<IDBDatabase> => {
  if (!db) {
    db = await initDatabase();
  }
  return db;
};

/**
 * ============================================
 * IMAGE DATABASE OPERATIONS
 * ============================================
 */

/**
 * Save an image to the database
 */
export const saveImage = async (image: Omit<ImageRecord, "id" | "uploadedAt">): Promise<string> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.IMAGES], "readwrite");
  const store = transaction.objectStore(STORES.IMAGES);

  const imageRecord: ImageRecord = {
    ...image,
    id: crypto.randomUUID(),
    uploadedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(imageRecord);
    request.onsuccess = () => {
      console.log(`✓ Image saved: ${imageRecord.id} (type: ${image.type})`);
      resolve(imageRecord.id);
    };
    request.onerror = () => {
      console.error("Failed to save image:", request.error);
      reject(request.error);
    };
  });
};

/**
 * Get an image by ID
 */
export const getImage = async (id: string): Promise<ImageRecord | null> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.IMAGES], "readonly");
  const store = transaction.objectStore(STORES.IMAGES);

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Get images by type
 */
export const getImagesByType = async (type: ImageType): Promise<ImageRecord[]> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.IMAGES], "readonly");
  const store = transaction.objectStore(STORES.IMAGES);
  const index = store.index("type");

  return new Promise((resolve, reject) => {
    const request = index.getAll(type);
    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Get gallery images by category
 */
export const getImagesByCategory = async (categoryId: string): Promise<ImageRecord[]> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.IMAGES], "readonly");
  const store = transaction.objectStore(STORES.IMAGES);
  const index = store.index("categoryId");

  return new Promise((resolve, reject) => {
    const request = index.getAll(categoryId);
    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Get the latest image of a specific type
 */
export const getLatestImageByType = async (type: ImageType): Promise<ImageRecord | null> => {
  const images = await getImagesByType(type);
  if (images.length === 0) return null;
  
  // Sort by uploadedAt descending and return the latest
  images.sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  
  return images[0];
};

/**
 * Delete an image
 */
export const deleteImage = async (id: string): Promise<void> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.IMAGES], "readwrite");
  const store = transaction.objectStore(STORES.IMAGES);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => {
      console.log(`✓ Image deleted: ${id}`);
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Get all images
 */
export const getAllImages = async (): Promise<ImageRecord[]> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.IMAGES], "readonly");
  const store = transaction.objectStore(STORES.IMAGES);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * ============================================
 * WEBSITE CONTENT DATABASE OPERATIONS
 * ============================================
 */

/**
 * Save website content
 */
export const saveWebsiteContent = async (
  type: ContentType,
  data: any
): Promise<string> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.WEBSITE_CONTENT], "readwrite");
  const store = transaction.objectStore(STORES.WEBSITE_CONTENT);

  const now = new Date().toISOString();
  const contentRecord: WebsiteContentRecord = {
    id: crypto.randomUUID(),
    type,
    data,
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(contentRecord);
    request.onsuccess = () => {
      console.log(`✓ Content saved: ${contentRecord.id} (type: ${type})`);
      resolve(contentRecord.id);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Update website content
 */
export const updateWebsiteContent = async (
  id: string,
  data: Partial<any>
): Promise<void> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.WEBSITE_CONTENT], "readwrite");
  const store = transaction.objectStore(STORES.WEBSITE_CONTENT);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (!existing) {
        reject(new Error("Content not found"));
        return;
      }

      const updated: WebsiteContentRecord = {
        ...existing,
        data: { ...existing.data, ...data },
        updatedAt: new Date().toISOString(),
      };

      const putRequest = store.put(updated);
      putRequest.onsuccess = () => {
        console.log(`✓ Content updated: ${id}`);
        resolve();
      };
      putRequest.onerror = () => {
        reject(putRequest.error);
      };
    };
    getRequest.onerror = () => {
      reject(getRequest.error);
    };
  });
};

/**
 * Get website content by type
 */
export const getWebsiteContentByType = async (
  type: ContentType
): Promise<WebsiteContentRecord[]> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.WEBSITE_CONTENT], "readonly");
  const store = transaction.objectStore(STORES.WEBSITE_CONTENT);
  const index = store.index("type");

  return new Promise((resolve, reject) => {
    const request = index.getAll(type);
    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Delete website content
 */
export const deleteWebsiteContent = async (id: string): Promise<void> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.WEBSITE_CONTENT], "readwrite");
  const store = transaction.objectStore(STORES.WEBSITE_CONTENT);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => {
      console.log(`✓ Content deleted: ${id}`);
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * ============================================
 * EVENTS DATABASE OPERATIONS
 * ============================================
 */

export interface EventRecord {
  id: string;
  day: string;
  month: string;
  title: string;
  description: string;
  time: string;
  location: string;
  featured: boolean;
  date?: string; // computed date for sorting
}

/**
 * Save an event
 */
export const saveEvent = async (event: Omit<EventRecord, "id">): Promise<string> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.EVENTS], "readwrite");
  const store = transaction.objectStore(STORES.EVENTS);

  const eventRecord: EventRecord = {
    ...event,
    id: crypto.randomUUID(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(eventRecord);
    request.onsuccess = () => resolve(eventRecord.id);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all events
 */
export const getAllEvents = async (): Promise<EventRecord[]> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.EVENTS], "readonly");
  const store = transaction.objectStore(STORES.EVENTS);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete an event
 */
export const deleteEvent = async (id: string): Promise<void> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.EVENTS], "readwrite");
  const store = transaction.objectStore(STORES.EVENTS);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * ============================================
 * GALLERY DATABASE OPERATIONS
 * ============================================
 */

export interface GalleryCategoryRecord {
  id: string;
  name: string;
  description?: string;
  date?: string;
}

export interface GalleryImageRecord {
  id: string;
  src: string;
  categoryId: string;
  date?: string;
  caption?: string;
}

/**
 * Save gallery category
 */
export const saveGalleryCategory = async (
  category: Omit<GalleryCategoryRecord, "id">
): Promise<string> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.GALLERY_CATEGORIES], "readwrite");
  const store = transaction.objectStore(STORES.GALLERY_CATEGORIES);

  const categoryRecord: GalleryCategoryRecord = {
    ...category,
    id: crypto.randomUUID(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(categoryRecord);
    request.onsuccess = () => resolve(categoryRecord.id);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all gallery categories
 */
export const getAllGalleryCategories = async (): Promise<GalleryCategoryRecord[]> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.GALLERY_CATEGORIES], "readonly");
  const store = transaction.objectStore(STORES.GALLERY_CATEGORIES);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Save gallery image
 */
export const saveGalleryImage = async (
  image: Omit<GalleryImageRecord, "id">
): Promise<string> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.GALLERY_IMAGES], "readwrite");
  const store = transaction.objectStore(STORES.GALLERY_IMAGES);

  const imageRecord: GalleryImageRecord = {
    ...image,
    id: crypto.randomUUID(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(imageRecord);
    request.onsuccess = () => resolve(imageRecord.id);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get gallery images by category
 */
export const getGalleryImagesByCategory = async (
  categoryId: string
): Promise<GalleryImageRecord[]> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.GALLERY_IMAGES], "readonly");
  const store = transaction.objectStore(STORES.GALLERY_IMAGES);
  const index = store.index("categoryId");

  return new Promise((resolve, reject) => {
    const request = index.getAll(categoryId);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * ============================================
 * CONTACT SUBMISSIONS DATABASE OPERATIONS
 * ============================================
 */

export interface ContactSubmissionRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
  read: boolean;
}

/**
 * Save contact submission
 */
export const saveContactSubmission = async (
  submission: Omit<ContactSubmissionRecord, "id" | "date">
): Promise<string> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.CONTACT_SUBMISSIONS], "readwrite");
  const store = transaction.objectStore(STORES.CONTACT_SUBMISSIONS);

  const submissionRecord: ContactSubmissionRecord = {
    ...submission,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(submissionRecord);
    request.onsuccess = () => resolve(submissionRecord.id);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all contact submissions
 */
export const getAllContactSubmissions = async (): Promise<ContactSubmissionRecord[]> => {
  const database = await getDatabase();
  const transaction = database.transaction([STORES.CONTACT_SUBMISSIONS], "readonly");
  const store = transaction.objectStore(STORES.CONTACT_SUBMISSIONS);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * ============================================
 * MIGRATION UTILITIES
 * ============================================
 */

/**
 * Migrate data from old storage format to new database structure
 */
export const migrateFromOldStorage = async (): Promise<void> => {
  try {
    // Try to load from old IndexedDB
    const oldDBRequest = indexedDB.open("icgc-site-db", 1);
    oldDBRequest.onsuccess = async () => {
      const oldDB = oldDBRequest.result;
      if (oldDB.objectStoreNames.contains("site-config")) {
        const transaction = oldDB.transaction(["site-config"], "readonly");
        const store = transaction.objectStore("site-config");
        const request = store.get("config");
        
        request.onsuccess = async () => {
          const oldConfig = request.result;
          if (oldConfig) {
            console.log("Migrating data from old storage format...");
            
            // Migrate images
            if (oldConfig.heroImage) {
              await saveImage({
                type: "hero",
                src: oldConfig.heroImage,
              });
            }
            if (oldConfig.communityImage) {
              await saveImage({
                type: "community",
                src: oldConfig.communityImage,
              });
            }
            if (oldConfig.aboutMainImage) {
              await saveImage({
                type: "about-main",
                src: oldConfig.aboutMainImage,
              });
            }
            if (oldConfig.aboutPastorImage) {
              await saveImage({
                type: "about-pastor",
                src: oldConfig.aboutPastorImage,
              });
            }
            
            // Migrate events
            if (oldConfig.events) {
              for (const event of oldConfig.events) {
                await saveEvent(event);
              }
            }
            
            // Migrate gallery categories
            if (oldConfig.galleryCategories) {
              for (const category of oldConfig.galleryCategories) {
                await saveGalleryCategory(category);
              }
            }
            
            // Migrate gallery images
            if (oldConfig.galleryImages) {
              for (const image of oldConfig.galleryImages) {
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
            
            // Migrate contact submissions
            if (oldConfig.contactSubmissions) {
              for (const submission of oldConfig.contactSubmissions) {
                await saveContactSubmission(submission);
              }
            }
            
            console.log("✓ Migration completed");
          }
        };
      }
    };
  } catch (error) {
    console.warn("Migration failed or no old data found:", error);
  }
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  const [images, events, categories, galleryImages, submissions] = await Promise.all([
    getAllImages(),
    getAllEvents(),
    getAllGalleryCategories(),
    getDatabase().then(db => {
      const transaction = db.transaction([STORES.GALLERY_IMAGES], "readonly");
      const store = transaction.objectStore(STORES.GALLERY_IMAGES);
      return new Promise<GalleryImageRecord[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    }),
    getAllContactSubmissions(),
  ]);

  return {
    images: {
      total: images.length,
      byType: {
        hero: images.filter(i => i.type === "hero").length,
        "about-main": images.filter(i => i.type === "about-main").length,
        "about-pastor": images.filter(i => i.type === "about-pastor").length,
        community: images.filter(i => i.type === "community").length,
        gallery: images.filter(i => i.type === "gallery").length,
      },
    },
    events: events.length,
    galleryCategories: categories.length,
    galleryImages: galleryImages.length,
    contactSubmissions: submissions.length,
  };
};

