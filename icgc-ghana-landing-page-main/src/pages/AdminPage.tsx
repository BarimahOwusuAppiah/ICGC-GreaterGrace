import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { compressImage, saveConfig } from "@/lib/storage";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Save, Check, Mail, Trash2, Eye, EyeOff } from "lucide-react";

const AdminPage = () => {
  const {
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
    removeContactSubmission,
    markContactSubmissionRead,
  } = useSiteConfig();

  const [newEvent, setNewEvent] = useState({
    day: "",
    month: "",
    title: "",
    description: "",
    time: "",
    location: "",
    featured: false,
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    date: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await saveConfig(config);
      setLastSaved(new Date());
      toast({
        title: "Saved successfully",
        description: "All changes have been saved.",
      });
    } catch (error) {
      console.error("Manual save failed:", error);
      toast({
        title: "Save failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save when config changes (for immediate persistence)
  useEffect(() => {
    const saveTimer = setTimeout(async () => {
      try {
        await saveConfig(config);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 100);
    
    return () => clearTimeout(saveTimer);
  }, [config]);

  const handleImageUpload = async (
    file: File | null,
    setter: (src: string) => void,
  ) => {
    if (!file) return;
    
    try {
      // Compress image before storing (max 1920px width, 80% quality)
      const compressedDataUrl = await compressImage(file, 1920, 0.8);
      setter(compressedDataUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Image has been compressed and saved.",
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGalleryUpload = async (files: FileList | null, categoryId: string) => {
    if (!files || files.length === 0 || !categoryId) return;
    
    const fileArray = Array.from(files);
    let successCount = 0;
    let failCount = 0;
    
    for (const file of fileArray) {
      try {
        // Compress each image before storing (max 1920px width, 80% quality)
        const compressedDataUrl = await compressImage(file, 1920, 0.8);
        const today = new Date().toISOString().split("T")[0];
        addGalleryImage({
          src: compressedDataUrl,
          categoryId: categoryId,
          date: today,
          caption: "",
        });
        successCount++;
      } catch (error) {
        console.error("Error compressing image:", error);
        failCount++;
      }
    }
    
    if (successCount > 0) {
      toast({
        title: "Images uploaded",
        description: `${successCount} image(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ""}.`,
      });
    } else if (failCount > 0) {
      toast({
        title: "Upload failed",
        description: "Failed to process images. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    addGalleryCategory(newCategory);
    // Clear form - the category will be available after state updates
    setNewCategory({
      name: "",
      description: "",
      date: "",
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    addEvent(newEvent);
    setNewEvent({
      day: "",
      month: "",
      title: "",
      description: "",
      time: "",
      location: "",
      featured: false,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 space-y-12">
          <header className="text-center mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1"></div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground flex-1 text-center">
                Admin Dashboard
              </h1>
              <div className="flex-1 flex justify-end">
                <Button
                  onClick={handleManualSave}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <Save className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : lastSaved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved {lastSaved.toLocaleTimeString()}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Now
                    </>
                  )}
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">
              Manage homepage images and events. Changes are automatically saved, or click "Save Now" to save manually.
            </p>
          </header>

          {/* Image settings */}
          <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold mb-4">Images</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload custom images for the Hero, About, and Community sections.
              Recommended landscape images for best results.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Hero image */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Hero Background Image
                </h3>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e.target.files?.[0] ?? null, setHeroImage)
                  }
                />
                {config.heroImage && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current image preview:
                    </p>
                    <img
                      src={config.heroImage}
                      alt="Custom hero"
                      className="w-full max-h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* About main image (church building) */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  About - Church Building Image
                </h3>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(
                      e.target.files?.[0] ?? null,
                      setAboutMainImage,
                    )
                  }
                />
                {config.aboutMainImage && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current image preview:
                    </p>
                    <img
                      src={config.aboutMainImage}
                      alt="Custom about main"
                      className="w-full max-h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* About pastor image */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  About - Pastor Image
                </h3>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(
                      e.target.files?.[0] ?? null,
                      setAboutPastorImage,
                    )
                  }
                />
                {config.aboutPastorImage && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current image preview:
                    </p>
                    <img
                      src={config.aboutPastorImage}
                      alt="Custom about pastor"
                      className="w-full max-h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Community image */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Community Image
                </h3>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(
                      e.target.files?.[0] ?? null,
                      setCommunityImage,
                    )
                  }
                />
                {config.communityImage && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current image preview:
                    </p>
                    <img
                      src={config.communityImage}
                      alt="Custom community"
                      className="w-full max-h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Events management */}
          <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold mb-4">
              Events
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Add, edit, or remove events shown on the Events pages.
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Existing events list */}
              <div className="lg:col-span-2 space-y-4">
                {config.events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-background rounded-xl border p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {event.day} {event.month}
                        </p>
                        <h3 className="font-semibold text-foreground">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-muted-foreground flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={event.featured}
                            onChange={(e) =>
                              updateEvent(event.id, { featured: e.target.checked })
                            }
                          />
                          Featured
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEvent(event.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.time} • {event.location}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add new event */}
              <form className="space-y-3" onSubmit={handleAddEvent}>
                <h3 className="font-semibold text-foreground mb-1">
                  Add New Event
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Day"
                    value={newEvent.day}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, day: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="Month"
                    value={newEvent.month}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, month: e.target.value }))
                    }
                  />
                </div>
                <Input
                  placeholder="Title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
                <Textarea
                  placeholder="Description"
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Time (e.g. 5:00 PM)"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
                <Input
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
                <label className="text-xs text-muted-foreground flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newEvent.featured}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                  />
                  Mark as featured
                </label>
                <Button type="submit" className="w-full">
                  Add Event
                </Button>
              </form>
            </div>
          </section>

          {/* Gallery Categories Management */}
          <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold mb-4">
              Gallery Categories
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Create categories (folders) to organize your gallery images by events or services.
              Each category acts like a folder containing related photos.
            </p>

            {/* Create New Category */}
            <div className="mb-8 p-6 bg-background rounded-xl border">
              <h3 className="font-semibold text-foreground mb-4">
                Create New Category
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-3">
                <Input
                  placeholder="Category Name (e.g., Sunday Service - Jan 15)"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
                <Textarea
                  placeholder="Description (optional)"
                  rows={2}
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <Input
                  type="date"
                  placeholder="Event Date (optional)"
                  value={newCategory.date}
                  onChange={(e) =>
                    setNewCategory((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
                <Button type="submit" className="w-full">
                  Create Category
                </Button>
              </form>
            </div>

            {/* Existing Categories */}
            {config.galleryCategories && config.galleryCategories.length > 0 ? (
              <div className="space-y-6 mb-8">
                {config.galleryCategories.map((category) => {
                  const categoryImages = config.galleryImages?.filter(
                    (img) => img.categoryId === category.id
                  ) || [];
                  return (
                    <div
                      key={category.id}
                      className="bg-background rounded-xl border p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg mb-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {category.description}
                            </p>
                          )}
                          {category.date && (
                            <p className="text-xs text-muted-foreground">
                              Date: {new Date(category.date).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {categoryImages.length}{" "}
                            {categoryImages.length === 1 ? "photo" : "photos"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeGalleryCategory(category.id)}
                        >
                          Delete Category
                        </Button>
                      </div>

                      {/* Upload Images to This Category */}
                      <div className="mb-4 p-4 bg-card rounded-lg border-2 border-dashed">
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Upload Images to This Category
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            handleGalleryUpload(e.target.files, category.id);
                          }}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          Select multiple images to add to "{category.name}"
                        </p>
                      </div>

                      {/* Images in This Category */}
                      {categoryImages.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {categoryImages.map((image) => (
                            <div
                              key={image.id}
                              className="bg-card rounded-lg border p-2 space-y-2"
                            >
                              <div className="aspect-square overflow-hidden rounded">
                                <img
                                  src={image.src}
                                  alt={image.caption || "Gallery image"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Input
                                type="date"
                                value={image.date || ""}
                                onChange={(e) =>
                                  updateGalleryImage(image.id, {
                                    date: e.target.value,
                                  })
                                }
                                className="text-xs h-8"
                                size={1}
                              />
                              <Textarea
                                placeholder="Caption..."
                                rows={2}
                                value={image.caption || ""}
                                onChange={(e) =>
                                  updateGalleryImage(image.id, {
                                    caption: e.target.value,
                                  })
                                }
                                className="text-xs resize-none h-16"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeGalleryImage(image.id)}
                                className="w-full text-xs h-7"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No images in this category yet. Upload images above.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No categories yet. Create a category above to get started.</p>
              </div>
            )}
          </section>

          {/* Contact Submissions Management */}
          <section className="bg-card rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold mb-4">
              Contact Form Submissions
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              View and manage messages submitted through the contact form.
            </p>

            {config.contactSubmissions && config.contactSubmissions.length > 0 ? (
              <div className="space-y-4">
                {config.contactSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`bg-background rounded-xl border p-6 space-y-3 ${
                      !submission.read ? "border-gold/50 bg-gold/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {submission.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {submission.email}
                            </p>
                            {submission.phone && (
                              <p className="text-xs text-muted-foreground">
                                {submission.phone}
                              </p>
                            )}
                          </div>
                          {!submission.read && (
                            <span className="px-2 py-1 text-xs font-medium bg-gold/20 text-gold rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                          {submission.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-3">
                          Submitted: {new Date(submission.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            markContactSubmissionRead(
                              submission.id,
                              !submission.read
                            )
                          }
                          className="gap-2"
                        >
                          {submission.read ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Mark Unread
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Mark Read
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeContactSubmission(submission.id)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No contact submissions yet.</p>
                <p className="text-sm mt-2">
                  Submissions from the contact form will appear here.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;


