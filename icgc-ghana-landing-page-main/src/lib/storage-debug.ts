/**
 * Debug utility to check storage status
 * Call this from browser console: window.checkStorage()
 */

export const checkStorage = () => {
  console.log("=== Storage Debug Info ===");
  
  // Check localStorage
  try {
    const localData = localStorage.getItem("icgc-site-config");
    if (localData) {
      const parsed = JSON.parse(localData);
      console.log("✓ localStorage has data:", {
        size: `${(localData.length / 1024).toFixed(2)} KB`,
        events: parsed.events?.length || 0,
        galleryCategories: parsed.galleryCategories?.length || 0,
        galleryImages: parsed.galleryImages?.length || 0,
        contactSubmissions: parsed.contactSubmissions?.length || 0,
        hasHeroImage: !!parsed.heroImage,
      });
    } else {
      console.warn("⚠ localStorage is empty");
    }
  } catch (error) {
    console.error("❌ localStorage error:", error);
  }
  
  // Check IndexedDB
  const request = indexedDB.open("icgc-site-db", 1);
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(["site-config"], "readonly");
    const store = transaction.objectStore("site-config");
    const getRequest = store.get("config");
    
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        console.log("✓ IndexedDB has data:", {
          events: data.events?.length || 0,
          galleryCategories: data.galleryCategories?.length || 0,
          galleryImages: data.galleryImages?.length || 0,
          contactSubmissions: data.contactSubmissions?.length || 0,
          hasHeroImage: !!data.heroImage,
        });
      } else {
        console.warn("⚠ IndexedDB is empty");
      }
    };
    
    getRequest.onerror = () => {
      console.error("❌ IndexedDB read error:", getRequest.error);
    };
  };
  
  request.onerror = () => {
    console.error("❌ IndexedDB open error:", request.error);
  };
};

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).checkStorage = checkStorage;
}

