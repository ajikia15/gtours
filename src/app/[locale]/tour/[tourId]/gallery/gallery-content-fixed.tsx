"use client";

import { useState } from "react";
import Image from "next/image";
import { Tour } from "@/types/Tour";
import { getImageUrl } from "@/lib/imageHelpers";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Download, Share } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  tour: Tour;
};

export default function GalleryContent({ tour }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const images = tour.images || [];

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="text-6xl mb-4">📷</div>
        <h3 className="text-xl font-semibold mb-2">No Images Available</h3>
        <p className="text-center max-w-md">
          This tour doesn&apos;t have any images yet. Check back later or
          contact us for more information.
        </p>
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

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 aspect-square"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={getImageUrl(image)}
              alt={`${tour.title[0]} - Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/50 text-white px-2 py-1 rounded text-sm">
                {index + 1} / {images.length}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-screen-lg w-full h-full max-h-screen p-0 bg-black/95"
          onPointerDownOutside={closeLightbox}
        >
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = getImageUrl(images[selectedImageIndex]);
                    link.download = `${tour.title[0]}-${
                      selectedImageIndex + 1
                    }.jpg`;
                    link.click();
                  }}
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: tour.title[0],
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <Share className="h-5 w-5" />
                </Button>
              </div>

              {/* Previous Button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {/* Next Button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}

              {/* Main Image */}
              <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-4">
                <Image
                  src={getImageUrl(images[selectedImageIndex])}
                  alt={`${tour.title[0]} - Image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex gap-2 bg-black/50 p-2 rounded-lg max-w-xs overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "relative w-12 h-12 rounded overflow-hidden flex-shrink-0 border-2 transition-all",
                          index === selectedImageIndex
                            ? "border-white"
                            : "border-transparent hover:border-white/50"
                        )}
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
