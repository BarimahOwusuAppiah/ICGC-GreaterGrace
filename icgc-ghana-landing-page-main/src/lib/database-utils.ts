/**
 * Database Utility Functions
 * 
 * Helper functions for managing and viewing the database
 */

import { getDatabaseStats, getDatabase } from "./database";

/**
 * Get database statistics for display in admin panel
 */
export const getDatabaseInfo = async () => {
  try {
    const stats = await getDatabaseStats();
    return {
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to get database info:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Clear all data from the database (use with caution!)
 */
export const clearAllDatabase = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    
    // Clear all object stores
    const stores = [
      "images",
      "website_content",
      "events",
      "gallery_categories",
      "gallery_images",
      "contact_submissions",
    ];

    for (const storeName of stores) {
      if (db.objectStoreNames.contains(storeName)) {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
    }

    console.log("✓ Database cleared");
  } catch (error) {
    console.error("Failed to clear database:", error);
    throw error;
  }
};

/**
 * Export database data as JSON
 */
export const exportDatabase = async () => {
  try {
    const stats = await getDatabaseStats();
    const db = await getDatabase();
    
    const exportData: any = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      data: {},
    };

    // Export from each store
    const stores = [
      "images",
      "website_content",
      "events",
      "gallery_categories",
      "gallery_images",
      "contact_submissions",
    ];

    for (const storeName of stores) {
      if (db.objectStoreNames.contains(storeName)) {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const data = await new Promise<any[]>((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });
        exportData.data[storeName] = data;
      }
    }

    return exportData;
  } catch (error) {
    console.error("Failed to export database:", error);
    throw error;
  }
};

// Make functions available globally for debugging
if (typeof window !== "undefined") {
  (window as any).getDatabaseInfo = getDatabaseInfo;
  (window as any).clearAllDatabase = clearAllDatabase;
  (window as any).exportDatabase = exportDatabase;
}

