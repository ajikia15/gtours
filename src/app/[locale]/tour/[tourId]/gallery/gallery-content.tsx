"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Tour } from "@/types/Tour";
import { getImageUrl } from "@/lib/imageHelpers";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Download, 
  Share, 
  ZoomIn, 
  Grid3X3,
  List,
  Eye,
  Calendar,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  tour: Tour;
};

type ViewMode = 'grid' | 'masonry' | 'list';

export default function GalleryContent({ tour }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [isLoading, setIsLoading] = useState(false);

  const images = tour.images || [];
  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen || selectedImageIndex === null) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        setSelectedImageIndex(prev => 
          prev === 0 ? images.length - 1 : (prev || 0) - 1
        );
        break;
      case 'ArrowRight':
        event.preventDefault();
        setSelectedImageIndex(prev => 
          prev === images.length - 1 ? 0 : (prev || 0) + 1
        );
        break;
      case 'Escape':
        event.preventDefault();
        closeLightbox();
        break;
    }
  }, [isOpen, selectedImageIndex, images.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <Eye className="w-12 h-12 text-gray-300" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              Coming Soon
            </Badge>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Gallery Coming Soon</h3>
        <p className="text-center max-w-md text-gray-600 leading-relaxed">
          We&apos;re preparing stunning visuals for this tour. Check back soon or contact us for a preview!
        </p>
        <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Available Soon</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{tour.title[0]}</span>
          </div>
        </div>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };
  const downloadImage = async (imageUrl: string, imageName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const shareImage = async () => {
    if (navigator.share && selectedImageIndex !== null) {
      try {
        await navigator.share({
          title: `${tour.title[0]} - Image ${selectedImageIndex + 1}`,
          text: `Check out this amazing view from ${tour.title[0]}!`,
          url: window.location.href,
        });      } catch (err) {
        // Fallback to copying URL
        console.log('Share failed, falling back to clipboard:', err);
        navigator.clipboard?.writeText(window.location.href);
      }
    }
  };

  const renderGalleryGrid = () => {    const gridClasses = {
      grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      masonry: "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4",
      list: "grid grid-cols-1 md:grid-cols-2 gap-8"
    };

    const aspectClasses = {
      grid: "aspect-square",
      masonry: "break-inside-avoid mb-4",
      list: "aspect-[4/3]"
    };

    return (
      <div className={gridClasses[viewMode]}>
        {images.map((image, index) => (
          <div
            key={index}            className={cn(
              "relative group cursor-pointer overflow-hidden rounded-xl bg-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
              aspectClasses[viewMode],
              viewMode === 'list' ? "flex flex-col" : "",
              viewMode === 'masonry' ? "hover:shadow-lg hover:shadow-black/20" : ""
            )}
            onClick={() => openLightbox(index)}
          >            <div className={cn("relative", viewMode === 'list' ? "flex-1" : "w-full", viewMode === 'masonry' ? "w-full" : "h-full")}>
              <Image
                src={getImageUrl(image)}
                alt={`${tour.title[0]} - Image ${index + 1}`}
                width={viewMode === 'masonry' ? 400 : undefined}
                height={viewMode === 'masonry' ? 600 : undefined}
                {...(viewMode === 'masonry' ? {} : { fill: true })}
                className={cn(
                  "transition-all duration-500 group-hover:scale-105",
                  viewMode === 'masonry' ? "w-full h-auto object-cover rounded-xl" : "object-cover"
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={index < 4 ? "eager" : "lazy"}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Image number */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium">
                  {index + 1}
                </Badge>
              </div>

              {/* Hover actions */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-gray-800 h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(index);
                    }}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === 'list' && (
              <div className="p-4 bg-white">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Image {index + 1}
                </h4>
                <p className="text-sm text-gray-600">
                  Part of {tour.title[0]} collection
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="text-xs">
              {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              High Resolution
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            Explore the beauty and highlights of {tour.title[0]} through our curated image collection.
          </p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            className="h-8 px-3"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'masonry' ? 'default' : 'ghost'}
            className="h-8 px-3"
            onClick={() => setViewMode('masonry')}
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm h-2"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            className="h-8 px-3"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Gallery Content */}
      {renderGalleryGrid()}

      {/* Lightbox Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-screen-xl w-full h-full max-h-screen p-0 bg-black/96 backdrop-blur-sm border-0"
          onPointerDownOutside={closeLightbox}
        >
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {tour.title[0]}
                    </h3>
                    <p className="text-white/70 text-sm">
                      Image {selectedImageIndex + 1} of {images.length}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={closeLightbox}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 rounded-full h-12 w-12"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 rounded-full h-12 w-12"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Main Image */}
              <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-6 mt-20 mb-32">
                <Image
                  src={getImageUrl(images[selectedImageIndex])}
                  alt={`${tour.title[0]} - Image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="95vw"
                  priority
                />
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="flex items-center justify-between">
                  {/* Thumbnail Navigation */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto max-w-md">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={cn(
                            "relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                            index === selectedImageIndex
                              ? "border-white ring-2 ring-white/50"
                              : "border-transparent hover:border-white/50"
                          )}
                        >
                          <Image
                            src={getImageUrl(image)}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={shareImage}
                      disabled={isLoading}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => downloadImage(
                        getImageUrl(images[selectedImageIndex]),
                        `${tour.title[0]}-${selectedImageIndex + 1}.jpg`
                      )}
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isLoading ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Keyboard hints */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 text-xs text-center">
                <p>Use ← → arrow keys to navigate • ESC to close</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
