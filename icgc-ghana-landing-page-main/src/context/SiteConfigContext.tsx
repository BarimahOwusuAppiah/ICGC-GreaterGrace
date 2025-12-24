import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { saveConfig, loadConfig } from "@/lib/storage";

type EventItem = {
  id: string;
  day: string;
  month: string;
  title: string;
  description: string;
  time: string;
  location: string;
  featured: boolean;
};

type GalleryCategory = {
  id: string;
  name: string;
  description?: string;
  date?: string; // optional date for the event
};

type GalleryImage = {
  id: string;
  src: string; // data URL or remote URL
  categoryId: string; // which category/folder this image belongs to
  date?: string; // optional date string (e.g., "2024-01-15")
  caption?: string; // optional caption/description
};

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string; // ISO date string
  read: boolean; // whether admin has read this submission
};

type SiteConfig = {
  heroImage?: string; // data URL or remote URL
  communityImage?: string;
  aboutMainImage?: string;
  aboutPastorImage?: string;
  events: EventItem[];
  galleryCategories: GalleryCategory[];
  galleryImages: GalleryImage[];
  contactSubmissions: ContactSubmission[];
};

type SiteConfigContextValue = {
  config: SiteConfig;
  setHeroImage: (src: string) => void;
  setCommunityImage: (src: string) => void;
  setAboutMainImage: (src: string) => void;
  setAboutPastorImage: (src: string) => void;
  addEvent: (event: Omit<EventItem, "id">) => void;
  updateEvent: (id: string, event: Partial<Omit<EventItem, "id">>) => void;
  removeEvent: (id: string) => void;
  addGalleryCategory: (category: Omit<GalleryCategory, "id">) => void;
  removeGalleryCategory: (id: string) => void;
  updateGalleryCategory: (id: string, updates: Partial<Omit<GalleryCategory, "id">>) => void;
  addGalleryImage: (image: Omit<GalleryImage, "id">) => void;
  removeGalleryImage: (id: string) => void;
  updateGalleryImage: (id: string, updates: Partial<Omit<GalleryImage, "id">>) => void;
  addContactSubmission: (submission: Omit<ContactSubmission, "id" | "date" | "read">) => void;
  removeContactSubmission: (id: string) => void;
  markContactSubmissionRead: (id: string, read: boolean) => void;
};

const STORAGE_KEY = "icgc-site-config"; // Keep for migration from localStorage

const defaultEvents: EventItem[] = [
  {
    id: "1",
    day: "22",
    month: "Dec",
    title: "Christmas Carol Service",
    description:
      "Join us for a special evening of Christmas carols, worship, and celebration of the birth of our Lord.",
    time: "5:00 PM",
    location: "Christ Temple, Accra",
    featured: true,
  },
  {
    id: "2",
    day: "31",
    month: "Dec",
    title: "Crossover Night Service",
    description:
      "End the year in God's presence as we cross over into the new year with prayer, worship, and thanksgiving.",
    time: "10:00 PM",
    location: "Christ Temple, Accra",
    featured: true,
  },
  {
    id: "3",
    day: "5",
    month: "Jan",
    title: "New Year Consecration",
    description:
      "Begin the new year with a week of fasting, prayer, and spiritual renewal.",
    time: "6:00 AM Daily",
    location: "All ICGC Assemblies",
    featured: false,
  },
  {
    id: "4",
    day: "14",
    month: "Feb",
    title: "Marriage Enrichment Seminar",
    description:
      "A special seminar for couples to strengthen their marriages and relationships.",
    time: "4:00 PM",
    location: "Christ Temple, Accra",
    featured: false,
  },
];

const defaultConfig: SiteConfig = {
  events: defaultEvents,
  galleryCategories: [],
  galleryImages: [],
  contactSubmissions: [],
};

const SiteConfigContext = createContext<SiteConfigContextValue | undefined>(
  undefined,
);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from IndexedDB (with localStorage fallback/migration) on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading configuration...");
        // First try IndexedDB
        const savedConfig = await loadConfig();
        
        if (savedConfig) {
          console.log("Loaded configuration:", {
            hasHeroImage: !!savedConfig.heroImage,
            eventsCount: savedConfig.events?.length || 0,
            galleryCategoriesCount: savedConfig.galleryCategories?.length || 0,
            galleryImagesCount: savedConfig.galleryImages?.length || 0,
            contactSubmissionsCount: savedConfig.contactSubmissions?.length || 0,
          });
          
          // Merge saved config with defaults to ensure all fields exist
          const mergedConfig: SiteConfig = {
            events:
              savedConfig.events && savedConfig.events.length > 0
                ? savedConfig.events
                : defaultEvents,
            heroImage: savedConfig.heroImage,
            communityImage: savedConfig.communityImage,
            aboutMainImage: savedConfig.aboutMainImage,
            aboutPastorImage: savedConfig.aboutPastorImage,
            galleryCategories: savedConfig.galleryCategories || [],
            galleryImages: savedConfig.galleryImages || [],
            contactSubmissions: savedConfig.contactSubmissions || [],
          };
          
          console.log("Setting config with:", {
            hasHeroImage: !!mergedConfig.heroImage,
            eventsCount: mergedConfig.events.length,
            contactSubmissionsCount: mergedConfig.contactSubmissions.length,
          });
          
          setConfig(mergedConfig);
        } else {
          console.log("No config in IndexedDB, checking localStorage...");
          // Try to migrate from localStorage if IndexedDB is empty
          try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) {
              console.log("Found config in localStorage, migrating...");
              const parsed = JSON.parse(raw) as SiteConfig;
              const migratedConfig = {
                events:
                  parsed.events && parsed.events.length > 0
                    ? parsed.events
                    : defaultEvents,
                heroImage: parsed.heroImage,
                communityImage: parsed.communityImage,
                aboutMainImage: parsed.aboutMainImage,
                aboutPastorImage: parsed.aboutPastorImage,
                galleryCategories: parsed.galleryCategories || [],
                galleryImages: parsed.galleryImages || [],
                contactSubmissions: parsed.contactSubmissions || [],
              };
              setConfig(migratedConfig);
              // Save to IndexedDB for future use
              await saveConfig(migratedConfig);
              console.log("Migration complete");
            } else {
              console.log("No saved configuration found, using defaults");
            }
          } catch (localError) {
            console.warn("Failed to migrate from localStorage:", localError);
          }
        }
      } catch (error) {
        console.error("Failed to load configuration:", error);
        // Fallback to localStorage
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw) {
            console.log("Loading from localStorage fallback...");
            const parsed = JSON.parse(raw) as SiteConfig;
            setConfig({
              events:
                parsed.events && parsed.events.length > 0
                  ? parsed.events
                  : defaultEvents,
              heroImage: parsed.heroImage,
              communityImage: parsed.communityImage,
              aboutMainImage: parsed.aboutMainImage,
              aboutPastorImage: parsed.aboutPastorImage,
              galleryCategories: parsed.galleryCategories || [],
              galleryImages: parsed.galleryImages || [],
              contactSubmissions: parsed.contactSubmissions || [],
            });
          }
        } catch (fallbackError) {
          console.error("Fallback load also failed:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Persist to storage whenever config changes (with minimal debounce)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Very short debounce (50ms) to batch rapid changes, but save quickly
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log("Saving configuration...", {
          hasHeroImage: !!config.heroImage,
          hasCommunityImage: !!config.communityImage,
          eventsCount: config.events.length,
          galleryCategoriesCount: config.galleryCategories.length,
          galleryImagesCount: config.galleryImages.length,
          contactSubmissionsCount: config.contactSubmissions.length,
        });
        
        // Ensure all required fields are present before saving
        const configToSave: SiteConfig = {
          events: config.events || defaultEvents,
          galleryCategories: config.galleryCategories || [],
          galleryImages: config.galleryImages || [],
          contactSubmissions: config.contactSubmissions || [],
          heroImage: config.heroImage,
          communityImage: config.communityImage,
          aboutMainImage: config.aboutMainImage,
          aboutPastorImage: config.aboutPastorImage,
        };
        
        await saveConfig(configToSave);
        
        // Verify the save worked by checking localStorage
        const verify = localStorage.getItem("icgc-site-config");
        if (verify) {
          const parsed = JSON.parse(verify);
          console.log("✓ Configuration saved and verified in localStorage", {
            eventsCount: parsed.events?.length || 0,
            contactSubmissionsCount: parsed.contactSubmissions?.length || 0,
            hasHeroImage: !!parsed.heroImage,
          });
        } else {
          console.warn("⚠ Save completed but verification failed");
        }
      } catch (error) {
        console.error("Failed to save configuration:", error);
        // The saveConfig function already handles localStorage fallback
      }
    }, 50); // Very short debounce - saves almost immediately

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [config]);

  // Save on page unload/visibility change - trigger immediate save
  useEffect(() => {
    // Use visibilitychange for when tab becomes hidden (can do async)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Cancel any pending debounced save
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        // Force immediate save (async is OK here)
        const configToSave: SiteConfig = {
          events: config.events || defaultEvents,
          galleryCategories: config.galleryCategories || [],
          galleryImages: config.galleryImages || [],
          contactSubmissions: config.contactSubmissions || [],
          heroImage: config.heroImage,
          communityImage: config.communityImage,
          aboutMainImage: config.aboutMainImage,
          aboutPastorImage: config.aboutPastorImage,
        };
        saveConfig(configToSave).then(() => {
          console.log("Saved on visibility change");
        }).catch((error) => {
          console.error("Failed to save on visibility change:", error);
        });
      }
    };

    // beforeunload - synchronous fallback only
    const handleBeforeUnload = () => {
      // Cancel any pending debounced save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Try synchronous save to localStorage as last resort
      try {
        const configToSave: SiteConfig = {
          events: config.events || defaultEvents,
          galleryCategories: config.galleryCategories || [],
          galleryImages: config.galleryImages || [],
          contactSubmissions: config.contactSubmissions || [],
          heroImage: config.heroImage,
          communityImage: config.communityImage,
          aboutMainImage: config.aboutMainImage,
          aboutPastorImage: config.aboutPastorImage,
        };
        // Save lightweight version synchronously
        const lightweight = {
          events: configToSave.events,
          galleryCategories: configToSave.galleryCategories,
          contactSubmissions: configToSave.contactSubmissions,
        };
        localStorage.setItem("icgc-site-config-light", JSON.stringify(lightweight));
        console.log("Saved lightweight config on beforeunload");
      } catch (error) {
        console.error("Failed to save on beforeunload:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [config]);

  const setHeroImage = (src: string) => {
    setConfig((prev) => ({ ...prev, heroImage: src }));
  };

  const setCommunityImage = (src: string) => {
    setConfig((prev) => ({ ...prev, communityImage: src }));
  };

  const setAboutMainImage = (src: string) => {
    setConfig((prev) => ({ ...prev, aboutMainImage: src }));
  };

  const setAboutPastorImage = (src: string) => {
    setConfig((prev) => ({ ...prev, aboutPastorImage: src }));
  };

  const addEvent = (event: Omit<EventItem, "id">) => {
    const id = crypto.randomUUID();
    setConfig((prev) => ({
      ...prev,
      events: [...prev.events, { ...event, id }],
    }));
  };

  const updateEvent = (id: string, event: Partial<Omit<EventItem, "id">>) => {
    setConfig((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
    }));
  };

  const removeEvent = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  };

  const addGalleryCategory = (category: Omit<GalleryCategory, "id">) => {
    const id = crypto.randomUUID();
    setConfig((prev) => ({
      ...prev,
      galleryCategories: [...prev.galleryCategories, { ...category, id }],
    }));
  };

  const removeGalleryCategory = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      galleryCategories: prev.galleryCategories.filter((cat) => cat.id !== id),
      // Also remove all images in this category
      galleryImages: prev.galleryImages.filter((img) => img.categoryId !== id),
    }));
  };

  const updateGalleryCategory = (id: string, updates: Partial<Omit<GalleryCategory, "id">>) => {
    setConfig((prev) => ({
      ...prev,
      galleryCategories: prev.galleryCategories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    }));
  };

  const addGalleryImage = (image: Omit<GalleryImage, "id">) => {
    const id = crypto.randomUUID();
    setConfig((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, { ...image, id }],
    }));
  };

  const removeGalleryImage = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((img) => img.id !== id),
    }));
  };

  const updateGalleryImage = (id: string, updates: Partial<Omit<GalleryImage, "id">>) => {
    setConfig((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    }));
  };

  const addContactSubmission = (submission: Omit<ContactSubmission, "id" | "date" | "read">) => {
    const id = crypto.randomUUID();
    const newSubmission: ContactSubmission = {
      ...submission,
      id,
      date: new Date().toISOString(),
      read: false,
    };
    setConfig((prev) => ({
      ...prev,
      contactSubmissions: [newSubmission, ...prev.contactSubmissions],
    }));
  };

  const removeContactSubmission = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      contactSubmissions: prev.contactSubmissions.filter((sub) => sub.id !== id),
    }));
  };

  const markContactSubmissionRead = (id: string, read: boolean) => {
    setConfig((prev) => ({
      ...prev,
      contactSubmissions: prev.contactSubmissions.map((sub) =>
        sub.id === id ? { ...sub, read } : sub
      ),
    }));
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        setHeroImage,
        setCommunityImage,
        setAboutMainImage,
        setAboutPastorImage,
        addEvent,
        updateEvent,
        removeEvent,
        addGalleryCategory,
        removeGalleryCategory,
        updateGalleryCategory,
        addGalleryImage,
        removeGalleryImage,
        updateGalleryImage,
        addContactSubmission,
        removeContactSubmission,
        markContactSubmissionRead,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = (): SiteConfigContextValue => {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return ctx;
};


