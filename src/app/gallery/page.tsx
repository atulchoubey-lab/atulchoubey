"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Eye, ZoomIn, X, Compass, Calendar, Heart, ShieldAlert, Sparkles, Smile, User, ChevronLeft, ChevronRight } from "lucide-react";
import { profileData } from "@/data/profile";

interface Photo {
  id: string;
  src: string;
  title: string;
  description: string;
  category: string;
  width: number;
  height: number;
  orientation: string;
  exclude_from_gallery?: boolean;
}

export default function Gallery() {
  const photos: Photo[] = profileData.photos || [];
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);

  // Swipe support states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Get unique categories (excluding those flagged as excluded)
  const visiblePhotos = photos.filter((p) => !p.exclude_from_gallery);
  const categories = ["All", ...Array.from(new Set(visiblePhotos.map((p) => p.category)))];

  const filteredPhotos = visiblePhotos.filter(
    (photo) => activeCategory === "All" || photo.category === activeCategory
  );

  // Preload next and previous images in the background
  useEffect(() => {
    if (!selectedPhoto || filteredPhotos.length <= 1) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;

    const nextImg = new window.Image();
    nextImg.src = filteredPhotos[nextIndex].src;

    const prevImg = new window.Image();
    prevImg.src = filteredPhotos[prevIndex].src;
  }, [selectedPhoto, filteredPhotos]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowRight") {
        const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
        if (currentIndex !== -1) {
          setSelectedPhoto(filteredPhotos[(currentIndex + 1) % filteredPhotos.length]);
        }
      } else if (e.key === "ArrowLeft") {
        const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
        if (currentIndex !== -1) {
          setSelectedPhoto(filteredPhotos[(currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, filteredPhotos]);

  // Touch handlers for swiping
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !selectedPhoto) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;

    if (isLeftSwipe) {
      // Swipe left = Next photo
      setSelectedPhoto(filteredPhotos[(currentIndex + 1) % filteredPhotos.length]);
    } else if (isRightSwipe) {
      // Swipe right = Previous photo
      setSelectedPhoto(filteredPhotos[(currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length]);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex !== -1) {
      setSelectedPhoto(filteredPhotos[(currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex !== -1) {
      setSelectedPhoto(filteredPhotos[(currentIndex + 1) % filteredPhotos.length]);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "family":
        return <Heart size={14} />;
      case "traditional":
        return <Compass size={14} />;
      case "travel":
        return <Sparkles size={14} />;
      case "lifestyle":
        return <Smile size={14} />;
      default:
        return <User size={14} />;
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-12">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Eye size={14} />
            <span>Gallery</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground">
            Life in Frames
          </h1>
          <p className="text-base sm:text-lg text-muted">
            A curated snapshot of my personal experiences, family moments, and travels.
          </p>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto pb-4 border-b border-card-border/40">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "bg-secondary/60 text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat !== "All" && getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Masonry Grid with Spotlight Dimming */}
        {filteredPhotos.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 max-w-6xl mx-auto [column-fill:_balance]">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo) => {
                const isSpotlit = hoveredPhotoId === null || hoveredPhotoId === photo.id;
                
                return (
                  <motion.div
                    layout
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: isSpotlit ? 1 : 0.4, 
                      scale: 1,
                      filter: isSpotlit ? "blur(0px)" : "blur(1px)"
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="break-inside-avoid glass-panel rounded-2xl overflow-hidden border border-card-border/80 hover:shadow-xl hover:border-accent/40 transition-all duration-300 relative group cursor-pointer flex flex-col mb-6"
                    onClick={() => setSelectedPhoto(photo)}
                    onMouseEnter={() => setHoveredPhotoId(photo.id)}
                    onMouseLeave={() => setHoveredPhotoId(null)}
                  >
                    <div className="relative w-full h-auto overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-auto object-cover rounded-t-2xl group-hover:scale-[1.01] transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Hover Zoom Overlay */}
                      <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                        <div className="p-3 bg-accent text-white rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform">
                          <ZoomIn size={18} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Clean text description card at the bottom */}
                    <div className="p-4 bg-card/65 backdrop-blur-sm border-t border-card-border/40 space-y-1 rounded-b-2xl">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-sm text-foreground group-hover:text-accent transition-colors leading-tight">
                          {photo.title}
                        </h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
                          {photo.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {photo.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto glass-panel p-8 rounded-2xl border border-card-border space-y-4">
            <ShieldAlert size={40} className="text-accent mx-auto" />
            <h3 className="font-display font-bold text-lg text-foreground">No photos found</h3>
            <p className="text-sm text-muted">No images match this category yet.</p>
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out select-none"
              onClick={() => setSelectedPhoto(null)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 p-2.5 bg-secondary/80 text-foreground rounded-full hover:bg-secondary transition-colors cursor-pointer z-50 shadow-lg"
                aria-label="Close Lightbox"
              >
                <X size={20} />
              </button>

              {/* Navigation Arrows (Desktop) */}
              <button
                onClick={handlePrev}
                className="absolute left-6 p-3 bg-secondary/70 hover:bg-secondary text-foreground rounded-full transition-colors cursor-pointer z-40 hidden md:block"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-6 p-3 bg-secondary/70 hover:bg-secondary text-foreground rounded-full transition-colors cursor-pointer z-40 hidden md:block"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>

              {/* Lightbox Content Container */}
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 30, stiffness: 250 }}
                className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Main image */}
                <div className="relative w-full overflow-hidden flex items-center justify-center rounded-t-3xl max-h-[60vh] bg-black/40">
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                </div>

                {/* Text description under modal */}
                <div className="w-full glass-panel p-6 border border-card-border/80 border-t-0 rounded-b-3xl space-y-2 text-left bg-card/90 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-lg sm:text-xl text-foreground">
                      {selectedPhoto.title}
                    </h2>
                    <span className="text-xs font-bold uppercase tracking-wider text-white bg-accent px-3 py-1 rounded-full">
                      {selectedPhoto.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                  
                  {/* Mobile Swipe / Arrow cues */}
                  <div className="text-[10px] text-muted/60 pt-2 font-mono flex items-center justify-between">
                    <span>Swipe left/right or use arrow keys to browse</span>
                    <span className="hidden md:inline">Photos: {filteredPhotos.findIndex(p => p.id === selectedPhoto.id) + 1} / {filteredPhotos.length}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
