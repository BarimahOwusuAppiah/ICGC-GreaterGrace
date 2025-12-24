import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useState } from "react";
import { X, Calendar, Folder, ArrowLeft, Images } from "lucide-react";
import { Button } from "@/components/ui/button";

const GalleryPage = () => {
  const { config } = useSiteConfig();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const categories = config.galleryCategories || [];
  const allImages = config.galleryImages || [];
  
  // Get images for the selected category
  const categoryImages = selectedCategory
    ? allImages.filter((img) => img.categoryId === selectedCategory)
    : [];
  
  // Get category info
  const currentCategory = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)
    : null;

  const openCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
  };

  const openImage = (image: { src: string; caption?: string; date?: string }) => {
    setSelectedImage(image.src);
    setSelectedCaption(image.caption || "");
    setSelectedDate(image.date || "");
  };

  const closeImage = () => {
    setSelectedImage(null);
    setSelectedCaption("");
    setSelectedDate("");
  };

  // Get image count for each category
  const getCategoryImageCount = (categoryId: string) => {
    return allImages.filter((img) => img.categoryId === categoryId).length;
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            {selectedCategory ? (
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={goBackToCategories}
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </Button>
                <p className="text-gold font-medium tracking-widest uppercase mb-4 text-sm">
                  {currentCategory?.name || "Gallery"}
                </p>
                {currentCategory?.description && (
                  <p className="text-muted-foreground mb-2">
                    {currentCategory.description}
                  </p>
                )}
                {currentCategory?.date && (
                  <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(currentCategory.date)}
                  </p>
                )}
              </div>
            ) : (
              <>
                <p className="text-gold font-medium tracking-widest uppercase mb-4 text-sm">
                  Sunday Service Gallery
                </p>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Moments of <span className="text-primary">Worship & Fellowship</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Browse our gallery organized by events and services. Click on a
                  category to view photos from that specific event.
                </p>
              </>
            )}
          </div>

          {/* Categories View */}
          {!selectedCategory && (
            <>
              {categories.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-4">
                    No categories yet.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Create categories and upload images from the admin page to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categories.map((category) => {
                    const imageCount = getCategoryImageCount(category.id);
                    const firstImage = allImages.find(
                      (img) => img.categoryId === category.id
                    );
                    return (
                      <div
                        key={category.id}
                        className="group relative bg-card rounded-2xl overflow-hidden cursor-pointer hover-lift shadow-soft border border-border"
                        onClick={() => openCategory(category.id)}
                      >
                        {/* Category Cover Image */}
                        <div className="aspect-video overflow-hidden bg-gradient-warm">
                          {firstImage ? (
                            <img
                              src={firstImage.src}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Folder className="w-16 h-16 text-gold/30" />
                            </div>
                          )}
                        </div>
                        {/* Category Info */}
                        <div className="p-6">
                          <h3 className="font-display text-xl font-bold text-foreground mb-2">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Images className="w-4 h-4" />
                              <span>{imageCount} {imageCount === 1 ? "photo" : "photos"}</span>
                            </div>
                            {category.date && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(category.date)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Images View (when category is selected) */}
          {selectedCategory && (
            <>
              {categoryImages.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-4">
                    No images in this category yet.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Upload images to this category from the admin page.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer hover-lift bg-card"
                      onClick={() => openImage(image)}
                    >
                      <img
                        src={image.src}
                        alt={image.caption || "Gallery image"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-cream">
                          {image.date && (
                            <div className="flex items-center gap-2 text-xs mb-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(image.date)}</span>
                            </div>
                          )}
                          {image.caption && (
                            <p className="text-sm font-medium line-clamp-2">
                              {image.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-cream hover:text-gold transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-5xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt={selectedCaption || "Gallery image"}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            {(selectedCaption || selectedDate) && (
              <div className="mt-4 text-center text-cream">
                {selectedDate && (
                  <div className="flex items-center justify-center gap-2 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedDate)}</span>
                  </div>
                )}
                {selectedCaption && (
                  <p className="text-lg">{selectedCaption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;

